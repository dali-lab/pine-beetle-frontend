import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';

import { logError } from '../../utils/logger';
import { MAP_STYLE_URL } from '../../utils/map';
import { resolveArcgisTileLayer } from '../../utils/arcgis';
import { isMapRemoved, markMapAsRemoved } from '../../utils/map-instance-tracker';

import './style.scss';

const SOURCE_ID = 'arcgis-raster-source';
const LAYER_ID = 'arcgis-raster-layer';

/**
 * Renders an ArcGIS Online hosted tile layer as a mapbox-gl raster layer.
 * The layer is referenced by its portal item id and resolved to a live tile
 * service at runtime, so republishing the service in ArcGIS updates the view.
 *
 * @param {Object} props
 * @param {string} props.itemId - ArcGIS Online portal item id (hosted tile Map Service)
 * @param {string} [props.title] - Accessible label for the map container
 */
const ArcgisRasterMap = ({ itemId, title = 'Map' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !itemId) return undefined;

    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_STYLE_URL,
      center: [-88, 33],
      zoom: 4,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true, showZoom: true }));

    let cancelled = false;

    const addArcgisLayer = async () => {
      const resolved = await resolveArcgisTileLayer(itemId);
      if (cancelled || isMapRemoved(map) || !resolved) return;

      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: 'raster',
          tiles: [resolved.tileUrl],
          tileSize: 256,
          attribution: 'Esri',
        });
      }

      if (!map.getLayer(LAYER_ID)) {
        map.addLayer({ id: LAYER_ID, type: 'raster', source: SOURCE_ID });
      }

      if (resolved.bounds) {
        map.fitBounds(resolved.bounds, { padding: 20, duration: 0 });
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

  return <div ref={containerRef} className="arcgis-raster-map" aria-label={title} />;
};

export default ArcgisRasterMap;
