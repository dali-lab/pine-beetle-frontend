/**
 * Helpers for consuming ArcGIS Online hosted tile layers.
 *
 * Content is managed by the client in ArcGIS Online. We reference a layer by its
 * portal item id and resolve the live tile service at runtime, so republishing the
 * service in ArcGIS surfaces new tiles in the app without a code change.
 */
import { logWarning } from './logger';

// In production, ArcGIS is reached through same-origin proxy paths (see
// src/_redirects) so ad/tracker blockers and privacy browsers — which block
// requests to arcgis.com — don't hide the maps. In local dev there is no proxy,
// so we call arcgis.com directly.
const USE_PROXY = process.env.NODE_ENV === 'production';
const RESOLVE_TIMEOUT_MS = 8000;

const ARCGIS_PORTAL = USE_PROXY ? '/arcgis-portal' : 'https://www.arcgis.com';

// Same-origin base for proxied tile URLs. Mapbox loads raster tiles inside a
// web worker, where a relative URL would resolve against the worker script's
// base rather than the page — so the tile template MUST be absolute.
const ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

// Rewrite an absolute ArcGIS host in a service url to its same-origin proxy URL.
const toProxyPath = (url) => (USE_PROXY
  ? ORIGIN + url
    .replace('https://tiles.arcgis.com', '/arcgis-tiles')
    .replace('https://www.arcgis.com', '/arcgis-portal')
  : url);

/**
 * Resolves an ArcGIS Online item id to a mapbox-gl raster tile template and bounds.
 * @param {string} itemId - ArcGIS Online portal item id (a hosted tile Map Service)
 * @returns {Promise<{
 *            tileUrl: string,
 *            bounds: ?[[number, number], [number, number]],
 *            title: ?string,
 *            snippet: ?string,
 *            modified: ?number,
 *          }|null>}
 *          tileUrl is an XYZ template ready for a mapbox raster source; bounds is the
 *          item extent as [[west, south], [east, north]] (lng/lat) or null if absent;
 *          title/snippet are the item's metadata and modified is its last-updated epoch
 *          (ms). Returns null when the item cannot be resolved.
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
    const tileUrl = `${toProxyPath(item.url).replace(/\/$/, '')}/tile/{z}/{y}/{x}`;

    // extent is [[xmin, ymin], [xmax, ymax]] in lng/lat -> mapbox bounds [[w, s], [e, n]].
    const bounds = Array.isArray(item.extent) && item.extent.length === 2
      ? item.extent
      : null;

    return {
      tileUrl,
      bounds,
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
