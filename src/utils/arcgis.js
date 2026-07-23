/**
 * Helpers for consuming ArcGIS Online hosted tile layers.
 *
 * Content is managed by the client in ArcGIS Online. We reference a layer by its
 * portal item id and resolve the live tile service at runtime, so republishing the
 * service in ArcGIS surfaces new tiles in the app without a code change.
 */
import { logWarning } from './logger';

// In production, ArcGIS is reached through same-origin proxy paths (see
// src/_redirects and netlify/edge-functions) so ad/tracker blockers and privacy
// browsers — which block requests to arcgis.com — don't hide the maps. In local
// dev there is no proxy, so we call arcgis.com directly.
//
// The proxy paths must NOT contain the substring "arcgis": blocker filter lists
// match on URL substrings, not just hostnames, so /arcgis-tiles/* would still be
// blocked even on our own domain. Neutral names (/map-*) slip past those rules.
const USE_PROXY = process.env.NODE_ENV === 'production';
const RESOLVE_TIMEOUT_MS = 8000;

// Scale denominator at zoom 0 in the ArcGIS Online / Web Mercator tiling scheme.
// A hosted tile service advertises LODs 0-23 but usually only caches a sub-range;
// its minScale/maxScale mark the zoom window that actually has tiles. Requesting
// outside it returns 404 and the raster shows nothing, so we derive min/max zoom
// from the scales and clamp the map to them.
const TILING_SCHEME_SCALE_Z0 = 591657527.591555;
const scaleToZoom = (scale) => (typeof scale === 'number' && scale > 0
  ? Math.round(Math.log2(TILING_SCHEME_SCALE_Z0 / scale))
  : null);

const ARCGIS_PORTAL = USE_PROXY ? '/map-portal' : 'https://www.arcgis.com';

// Same-origin base for proxied tile URLs. Mapbox loads raster tiles inside a
// web worker, where a relative URL would resolve against the worker script's
// base rather than the page — so the tile template MUST be absolute.
const ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

// Rewrite an absolute ArcGIS host in a service url to its same-origin proxy URL.
const toProxyPath = (url) => (USE_PROXY
  ? ORIGIN + url
    .replace('https://tiles.arcgis.com', '/map-tiles')
    .replace('https://www.arcgis.com', '/map-portal')
  : url);

/**
 * Resolves an ArcGIS Online item id to a mapbox-gl raster tile template and bounds.
 * @param {string} itemId - ArcGIS Online portal item id (a hosted tile Map Service)
 * @returns {Promise<{
 *            tileUrl: string,
 *            bounds: ?[[number, number], [number, number]],
 *            minzoom: ?number,
 *            maxzoom: ?number,
 *            title: ?string,
 *            snippet: ?string,
 *            modified: ?number,
 *          }|null>}
 *          tileUrl is an XYZ template ready for a mapbox raster source; bounds is the
 *          item extent as [[west, south], [east, north]] (lng/lat) or null if absent;
 *          minzoom/maxzoom are the zoom levels the service actually has tiles for
 *          (null if unknown); title/snippet are the item's metadata and modified is
 *          its last-updated epoch (ms). Returns null when the item cannot be resolved.
 */
export const resolveArcgisTileLayer = async (itemId) => {
  if (!itemId) return null;

  // Fail fast if the request is blocked or hangs, so the UI can show an error
  // instead of an indefinitely blank map.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RESOLVE_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${ARCGIS_PORTAL}/sharing/rest/content/items/${itemId}?f=json`,
      { signal: controller.signal }
    );
    if (!response.ok) {
      logWarning('ArcGIS item request failed', { status: response.status }, { function: 'resolveArcgisTileLayer', itemId });
      return null;
    }

    const item = await response.json();
    if (item.error || !item.url) {
      logWarning('ArcGIS item has no service url', item.error || null, { function: 'resolveArcgisTileLayer', itemId });
      return null;
    }

    // item.url points at the MapServer/ImageServer endpoint of the hosted tile
    // service; route it through the same-origin proxy so it isn't blocked.
    const serviceUrl = toProxyPath(item.url).replace(/\/$/, '');
    const tileUrl = `${serviceUrl}/tile/{z}/{y}/{x}`;

    // extent is [[xmin, ymin], [xmax, ymax]] in lng/lat -> mapbox bounds [[w, s], [e, n]].
    const bounds = Array.isArray(item.extent) && item.extent.length === 2
      ? item.extent
      : null;

    // Read the service metadata to learn the zoom window that actually has tiles.
    // minScale = most zoomed-out level (mapbox minzoom), maxScale = most zoomed-in
    // (mapbox maxzoom). Non-fatal: fall back to mapbox defaults if unavailable.
    let minzoom = null;
    let maxzoom = null;
    try {
      const metaRes = await fetch(`${serviceUrl}?f=json`, { signal: controller.signal });
      if (metaRes.ok) {
        const meta = await metaRes.json();
        minzoom = scaleToZoom(meta.minScale);
        maxzoom = scaleToZoom(meta.maxScale);
      }
    } catch (metaError) {
      logWarning('Could not read ArcGIS service zoom range', metaError, { function: 'resolveArcgisTileLayer', itemId });
    }

    return {
      tileUrl,
      bounds,
      minzoom,
      maxzoom,
      title: item.title || null,
      snippet: item.snippet || null,
      modified: typeof item.modified === 'number' ? item.modified : null,
    };
  } catch (error) {
    logWarning('Error resolving ArcGIS tile layer', error, { function: 'resolveArcgisTileLayer', itemId });
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

export default resolveArcgisTileLayer;
