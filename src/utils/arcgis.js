/**
 * Helpers for consuming ArcGIS Online hosted tile layers.
 *
 * Content is managed by the client in ArcGIS Online. We reference a layer by its
 * portal item id and resolve the live tile service at runtime, so republishing the
 * service in ArcGIS surfaces new tiles in the app without a code change.
 */
import { logWarning } from './logger';

const ARCGIS_PORTAL = 'https://www.arcgis.com';

/**
 * Resolves an ArcGIS Online item id to a mapbox-gl raster tile template and bounds.
 * @param {string} itemId - ArcGIS Online portal item id (a hosted tile Map Service)
 * @returns {Promise<{ tileUrl: string, bounds: ?[[number, number], [number, number]] }|null>}
 *          tileUrl is an XYZ template ready for a mapbox raster source; bounds is the
 *          item extent as [[west, south], [east, north]] (lng/lat) or null if absent.
 *          Returns null when the item cannot be resolved.
 */
export const resolveArcgisTileLayer = async (itemId) => {
  if (!itemId) return null;

  try {
    const response = await fetch(`${ARCGIS_PORTAL}/sharing/rest/content/items/${itemId}?f=json`);
    if (!response.ok) {
      logWarning('ArcGIS item request failed', { status: response.status }, { function: 'resolveArcgisTileLayer', itemId });
      return null;
    }

    const item = await response.json();
    if (item.error || !item.url) {
      logWarning('ArcGIS item has no service url', item.error || null, { function: 'resolveArcgisTileLayer', itemId });
      return null;
    }

    // item.url points at the MapServer/ImageServer endpoint of the hosted tile service.
    const tileUrl = `${item.url.replace(/\/$/, '')}/tile/{z}/{y}/{x}`;

    // extent is [[xmin, ymin], [xmax, ymax]] in lng/lat -> mapbox bounds [[w, s], [e, n]].
    const bounds = Array.isArray(item.extent) && item.extent.length === 2
      ? item.extent
      : null;

    return { tileUrl, bounds };
  } catch (error) {
    logWarning('Error resolving ArcGIS tile layer', error, { function: 'resolveArcgisTileLayer', itemId });
    return null;
  }
};

export default resolveArcgisTileLayer;
