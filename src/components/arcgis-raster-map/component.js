import mapboxgl from 'mapbox-gl';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { logError } from '../../utils/logger';
import { MAP_STYLE_URL } from '../../utils/map';
import { resolveArcgisTileLayer } from '../../utils/arcgis';
import { isMapRemoved, markMapAsRemoved } from '../../utils/map-instance-tracker';

import './style.scss';

const SOURCE_ID = 'arcgis-raster-source';
const LAYER_ID = 'arcgis-raster-layer';

// Snippets that are clearly placeholders and should not be shown to end users.
const PLACEHOLDER_SNIPPETS = new Set(['', 'test', 'test test']);

/**
 * Renders an ArcGIS Online hosted tile layer as a mapbox-gl raster layer.
 * The layer is referenced by its portal item id and resolved to a live tile
 * service at runtime, so republishing the service in ArcGIS updates the view.
 *
 * There is intentionally no loading spinner: it re-triggered on every content
 * change and lingered, which was worse UX than just showing the basemap while
 * the raster tiles stream in.
 *
 * @param {Object} props
 * @param {string} props.itemId - ArcGIS Online portal item id (hosted tile Map Service)
 * @param {string} [props.title] - Accessible label for the map container
 * @param {string} [props.errorMessage] - Message shown when the map cannot be loaded
 */
const ArcgisRasterMap = ({
  itemId,
  title = 'Map',
  errorMessage = 'This map is temporarily unavailable. Please try again later.',
}) => {
  const containerRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    if (!containerRef.current || !itemId) return undefined;

    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
    setHasError(false);
    setMeta(null);

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_STYLE_URL,
      center: [-88, 33],
      zoom: 4,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true, showZoom: true }));

    let cancelled = false;

    // On the first page load the map can be created before the stylesheet has
    // applied its fixed container height, so the GL canvas is 0-sized and never
    // requests any tiles — the raster only appears after some later resize (e.g.
    // reopening the page). Watch the container and resize whenever it changes so
    // the map always ends up with the right dimensions.
    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
        if (!cancelled && !isMapRemoved(map)) map.resize();
      })
      : null;
    if (resizeObserver && containerRef.current) resizeObserver.observe(containerRef.current);

    const addArcgisLayer = async () => {
      try {
        const resolved = await resolveArcgisTileLayer(itemId);
        if (cancelled || isMapRemoved(map)) return;

        if (!resolved) {
          setHasError(true);
          return;
        }

        if (!map.getSource(SOURCE_ID)) {
          map.addSource(SOURCE_ID, {
            type: 'raster',
            tiles: [resolved.tileUrl],
            tileSize: 256,
            attribution: 'Esri',
            // The service only caches tiles within this zoom window; setting
            // maxzoom makes mapbox overzoom (scale) the deepest tiles instead of
            // requesting non-existent ones (which 404 and render nothing).
            ...(resolved.minzoom != null ? { minzoom: resolved.minzoom } : {}),
            ...(resolved.maxzoom != null ? { maxzoom: resolved.maxzoom } : {}),
          });
        }

        if (!map.getLayer(LAYER_ID)) {
          map.addLayer({ id: LAYER_ID, type: 'raster', source: SOURCE_ID });
        }

        // Sync the canvas to the container's real size BEFORE fitting bounds, so
        // fitBounds computes the zoom against correct dimensions (otherwise the
        // view can land at the wrong zoom and show nothing).
        map.resize();

        // Keep the map from zooming out past the data's lowest tile level — below
        // it every tile 404s and the raster vanishes, leaving only the basemap.
        if (resolved.minzoom != null) {
          map.setMinZoom(resolved.minzoom);
        }

        if (resolved.bounds) {
          // Never fit tighter/looser than the tiled range: clamp so the initial
          // view always lands where tiles exist.
          map.fitBounds(resolved.bounds, {
            padding: 20,
            duration: 0,
            ...(resolved.maxzoom != null ? { maxZoom: resolved.maxzoom } : {}),
          });
        }

        // Only expose the metadata once the raster layer is configured
        // successfully, so the caption never implies that a failed map loaded.
        setMeta(resolved);
        setHasError(false);
      } catch (error) {
        if (cancelled || isMapRemoved(map)) return;

        logError('Error adding ArcGIS map layer', error, {
          component: 'ArcgisRasterMap',
          itemId,
        });
        setMeta(null);
        setHasError(true);
      }
    };

    // Start exactly once as soon as Mapbox has initialized the style. Do not
    // gate this on isStyleLoaded(): that method also waits for every basemap
    // source, so the initial style event can be missed permanently in slower
    // browsers (especially Firefox) and the ArcGIS request never starts.
    let layerSetupStarted = false;
    const startArcgisLayerSetup = () => {
      if (layerSetupStarted || cancelled || isMapRemoved(map)) return;

      layerSetupStarted = true;
      addArcgisLayer();
    };

    map.once('style.load', startArcgisLayerSetup);

    // Register the listener before the fast-path check so a style finishing
    // between the two operations cannot start setup twice or be missed.
    if (map.isStyleLoaded()) {
      map.off('style.load', startArcgisLayerSetup);
      startArcgisLayerSetup();
    }

    return () => {
      cancelled = true;
      map.off('style.load', startArcgisLayerSetup);
      if (resizeObserver) resizeObserver.disconnect();
      if (map && typeof map.remove === 'function' && !isMapRemoved(map)) {
        try {
          markMapAsRemoved(map);
          map.remove();
        } catch (error) {
          logError('Error cleaning up ArcGIS map', error, { component: 'ArcgisRasterMap' });
        }
      }
    };
  }, [itemId]);

  const caption = useMemo(() => {
    if (!meta) return null;

    const parts = ['Source: ArcGIS Online (Esri)'];
    if (meta.modified) {
      const updated = new Date(meta.modified).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
      parts.push(`Updated ${updated}`);
    }

    const description = meta.snippet && !PLACEHOLDER_SNIPPETS.has(meta.snippet.trim().toLowerCase())
      ? meta.snippet.trim()
      : null;

    return { description, source: parts.join(' · ') };
  }, [meta]);

  return (
    <div className="arcgis-raster-map">
      <div className="arcgis-raster-map__frame">
        <div ref={containerRef} className="arcgis-raster-map__canvas" aria-label={title} />

        {hasError && (
          <div className="arcgis-raster-map__overlay arcgis-raster-map__overlay--error">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>

      {caption && (
        <p className="arcgis-raster-map__caption">
          {caption.description && <span>{caption.description} </span>}
          <span className="arcgis-raster-map__source">{caption.source}</span>
        </p>
      )}
    </div>
  );
};

export default ArcgisRasterMap;
