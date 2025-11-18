import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { generateMap } from '../utils';
import MAP_INIT_CONSTANTS from '../constants/map-constants';

/**
 * Custom hook to handle map initialization with proper cleanup and race condition prevention
 * @param {Function} setMap - Setter for map instance
 * @param {string} dataMode - Current data mode
 * @param {Function} clickCallback - Click callback function
 * @param {Function} hoverCallback - Hover callback function
 * @param {Array} thresholds - Legend thresholds
 * @param {Array} colors - Legend colors
 * @param {Array} dependencies - Dependencies array for useEffect
 */
const useMapInitialization = (
  setMap,
  dataMode,
  clickCallback,
  hoverCallback,
  thresholds,
  colors,
  dependencies = [],
) => {
  const mapInitTimeoutRef = useRef(null);
  const containerCheckTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  const retryCountRef = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;
    retryCountRef.current = 0;

    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

    if (mapInitTimeoutRef.current) {
      clearTimeout(mapInitTimeoutRef.current);
      mapInitTimeoutRef.current = null;
    }
    if (containerCheckTimeoutRef.current) {
      clearTimeout(containerCheckTimeoutRef.current);
      containerCheckTimeoutRef.current = null;
    }

    mapInitTimeoutRef.current = setTimeout(() => {
      mapInitTimeoutRef.current = null;

      if (!isMountedRef.current) return;

      setMap(null);

      const checkContainer = () => {
        if (!isMountedRef.current) return;

        if (retryCountRef.current >= MAP_INIT_CONSTANTS.MAX_CONTAINER_CHECK_RETRIES) {
          console.error('Map container not found after maximum retries');
          return;
        }

        const container = document.getElementById('map');
        if (container) {
          retryCountRef.current = 0;
          generateMap(
            true,
            null,
            thresholds,
            colors,
            () => {},
            dataMode,
            clickCallback,
            () => {},
            hoverCallback,
            () => {},
            setMap,
          );
        } else {
          retryCountRef.current += 1;
          containerCheckTimeoutRef.current = setTimeout(() => {
            containerCheckTimeoutRef.current = null;
            if (isMountedRef.current) {
              checkContainer();
            }
          }, MAP_INIT_CONSTANTS.CONTAINER_CHECK_INTERVAL);
        }
      };
      checkContainer();
    }, MAP_INIT_CONSTANTS.INIT_DELAY);

    return () => {
      isMountedRef.current = false;
      retryCountRef.current = 0;
      if (mapInitTimeoutRef.current) {
        clearTimeout(mapInitTimeoutRef.current);
        mapInitTimeoutRef.current = null;
      }
      if (containerCheckTimeoutRef.current) {
        clearTimeout(containerCheckTimeoutRef.current);
        containerCheckTimeoutRef.current = null;
      }
    };
  }, [dataMode, ...dependencies]);
};

export default useMapInitialization;
