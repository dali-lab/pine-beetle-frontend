import mapboxgl from 'mapbox-gl';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

// Loader import disabled together with the loading overlay (see render below).
// import Loader from '../loader';
import { logError } from '../../utils/logger';
import { MAP_STYLE_URL } from '../../utils/map';
import { resolveArcgisTileLayer } from '../../utils/arcgis';
import { isMapRemoved, markMapAsRemoved } from '../../utils/map-instance-tracker';

import './style.scss';

const SOURCE_ID = 'arcgis-raster-source';
const LAYER_ID = 'arcgis-raster-layer';

const STATUS = { LOADING: 'loading', READY: 'ready', ERROR: 'error' };

// Snippets that are clearly placeholders and should not be shown to end users.
const PLACEHOLDER_SNIPPETS = new Set(['', 'test', 'test test']);

/**
 * Renders an ArcGIS Online hosted tile layer as a mapbox-gl raster layer.
 * The layer is referenced by its portal item id and resolved to a live tile
 * service at runtime, so republishing the service in ArcGIS updates the view.
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
  const [status, setStatus] = useState(STATUS.LOADING);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    if (!containerRef.current || !itemId) return undefined;

    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
    setStatus(STATUS.LOADING);
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

    // Hide the spinner as soon as the raster is usable. We must NOT wait for
    // isSourceLoaded(): a raster whose extent is smaller than the viewport has
    // permanent 404 tiles (ocean / outside coverage), so the source never
    // reports "fully loaded" and the spinner would hang forever. Instead we go
    // ready on the first tile event for our source.
    //
    // The timeout is armed here at mount (not after style/resolve) so the
    // spinner ALWAYS clears — even if the style never loads, the item can't be
    // resolved, or every tile fails. It is the guaranteed backstop.
    let readyFallback;
    const markReady = () => {
      if (cancelled) return;
      clearTimeout(readyFallback);
      setStatus(STATUS.READY);
    };
    readyFallback = setTimeout(markReady, 8000);

    const onSourceData = (e) => {
      if (e.sourceId !== SOURCE_ID) return;
      if (e.tile || map.isSourceLoaded(SOURCE_ID)) {
        map.off('sourcedata', onSourceData);
        markReady();
      }
    };

    const addArcgisLayer = async () => {
      const resolved = await resolveArcgisTileLayer(itemId);
      if (cancelled || isMapRemoved(map)) return;

      if (!resolved) {
        setStatus(STATUS.ERROR);
        return;
      }

      setMeta(resolved);
      map.on('sourcedata', onSourceData);

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
    };

    // Add the layer as soon as the style is ready. We key off style readiness
    // rather than the map's 'load' event because 'load' waits for the render
    // loop, which browsers throttle while the tab is backgrounded — the style,
    // and therefore our layer, would otherwise never get added.
    if (map.isStyleLoaded()) {
      addArcgisLayer();
    } else {
      const onStyleData = () => {
        if (!map.isStyleLoaded()) return;
        map.off('styledata', onStyleData);
        addArcgisLayer();
      };
      map.on('styledata', onStyleData);
    }

    return () => {
      cancelled = true;
      if (readyFallback) clearTimeout(readyFallback);
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

        {/* Loading spinner disabled: it re-triggered on every content change and
            lingered (up to the ready fallback), which was worse UX than just
            showing the basemap while tiles stream in. Re-enable if needed.
        {status === STATUS.LOADING && (
          <div className="arcgis-raster-map__overlay">
            <Loader inline message="Loading map…" />
          </div>
        )} */}

        {status === STATUS.ERROR && (
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
