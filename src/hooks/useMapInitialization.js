import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { generateMap } from '../utils';

// Constants
const MAP_INIT_DELAY = 100; // ms - delay before initializing map
const CONTAINER_CHECK_INTERVAL = 50; // ms - interval for checking if map container exists

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

  useEffect(() => {
    isMountedRef.current = true;

    // Set mapbox access token
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

    // Clear any existing timeouts
    if (mapInitTimeoutRef.current) {
      clearTimeout(mapInitTimeoutRef.current);
      mapInitTimeoutRef.current = null;
    }
    if (containerCheckTimeoutRef.current) {
      clearTimeout(containerCheckTimeoutRef.current);
      containerCheckTimeoutRef.current = null;
    }

    // Delay map initialization
    mapInitTimeoutRef.current = setTimeout(() => {
      mapInitTimeoutRef.current = null;

      if (!isMountedRef.current) return;

      setMap(null);

      // Wait for the map container to be available
      const checkContainer = () => {
        if (!isMountedRef.current) return;

        const container = document.getElementById('map');
        if (container) {
          // Only generate map if container exists and component is still mounted
          generateMap(
            true,
            null, // map is null since we're regenerating
            thresholds,
            colors,
            () => {}, // No-op function since we use LegendOverlay instead
            dataMode,
            clickCallback,
            () => {}, // setMapClickCallback - handled by useMapCallbacks
            hoverCallback,
            () => {}, // setMapHoverCallback - handled by useMapCallbacks
            setMap,
          );
        } else {
          containerCheckTimeoutRef.current = setTimeout(() => {
            containerCheckTimeoutRef.current = null;
            if (isMountedRef.current) {
              checkContainer();
            }
          }, CONTAINER_CHECK_INTERVAL);
        }
      };
      checkContainer();
    }, MAP_INIT_DELAY);

    return () => {
      isMountedRef.current = false;
      // Cleanup timeouts on unmount or dependency change
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
