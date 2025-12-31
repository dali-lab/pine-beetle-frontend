import { useEffect, useRef } from 'react';
import { STATE_VECTOR_LAYER, VECTOR_LAYER } from '../constants';
import { isMapRemoved } from '../utils/map-instance-tracker';

/**
 * Custom hook to manage map event callbacks with proper cleanup
 * @param {Object} map - Mapbox map instance
 * @param {Function} onVectorClick - Callback for vector layer clicks
 * @param {Function} onHover - Callback for mouse move events
 * @param {Function} onStateClick - Callback for state layer clicks
 * @param {Function} onMouseLeave - Callback for mouse leave events
 * @param {Array} dependencies - Dependencies array for useEffect
 */
const useMapCallbacks = (
  map,
  onVectorClick,
  onHover,
  onStateClick,
  onMouseLeave,
  dependencies = []
) => {
  const callbacksRef = useRef({
    vectorClick: null,
    hover: null,
    stateClick: null,
    mouseLeave: null,
  });

  useEffect(() => {
    if (!map || !onVectorClick) {
      return;
    }

    const previousCallback = callbacksRef.current.vectorClick;
    if (previousCallback && !isMapRemoved(map) && map.off && typeof map.off === 'function') {
      try {
        map.off('click', VECTOR_LAYER, previousCallback);
      } catch (error) {
        // Silently ignore - map may be in invalid state
      }
    }

    const currentCallback = onVectorClick;
    callbacksRef.current.vectorClick = currentCallback;
    map.on('click', VECTOR_LAYER, currentCallback);

    // eslint-disable-next-line consistent-return
    return () => {
      if (map && !isMapRemoved(map) && currentCallback && map.off && typeof map.off === 'function') {
        try {
          map.off('click', VECTOR_LAYER, currentCallback);
        } catch (error) {
          // Silently ignore - map may be in invalid state
        }
        // Note: Not setting ref to null here - it will be overwritten on next effect run
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, onVectorClick, ...dependencies]);

  useEffect(() => {
    if (!map || !onHover) {
      return;
    }

    const previousCallback = callbacksRef.current.hover;
    if (previousCallback && !isMapRemoved(map) && map.off && typeof map.off === 'function') {
      try {
        map.off('mousemove', previousCallback);
      } catch (error) {
        // Silently ignore - map may be in invalid state
      }
    }

    const currentCallback = onHover;
    callbacksRef.current.hover = currentCallback;
    map.on('mousemove', currentCallback);

    // eslint-disable-next-line consistent-return
    return () => {
      if (map && !isMapRemoved(map) && currentCallback && map.off && typeof map.off === 'function') {
        try {
          map.off('mousemove', currentCallback);
        } catch (error) {
          // Silently ignore - map may be in invalid state
        }
        // Note: Not setting ref to null here - it will be overwritten on next effect run
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, onHover, ...dependencies]);

  useEffect(() => {
    if (!map || !onStateClick) {
      return;
    }

    const previousCallback = callbacksRef.current.stateClick;
    if (previousCallback && !isMapRemoved(map) && map.off && typeof map.off === 'function') {
      try {
        map.off('click', STATE_VECTOR_LAYER, previousCallback);
      } catch (error) {
        // Silently ignore - map may be in invalid state
      }
    }

    const currentCallback = onStateClick;
    callbacksRef.current.stateClick = currentCallback;
    map.on('click', STATE_VECTOR_LAYER, currentCallback);

    // eslint-disable-next-line consistent-return
    return () => {
      if (map && !isMapRemoved(map) && currentCallback && map.off && typeof map.off === 'function') {
        try {
          map.off('click', STATE_VECTOR_LAYER, currentCallback);
        } catch (error) {
          // Silently ignore - map may be in invalid state
        }
        // Note: Not setting ref to null here - it will be overwritten on next effect run
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, onStateClick, ...dependencies]);

  useEffect(() => {
    if (!map || !onMouseLeave) {
      return;
    }

    const previousCallback = callbacksRef.current.mouseLeave;
    if (previousCallback && !isMapRemoved(map) && map.off && typeof map.off === 'function') {
      try {
        map.off('mouseleave', VECTOR_LAYER, previousCallback);
      } catch (error) {
        // Silently ignore - map may be in invalid state
      }
    }

    const currentCallback = onMouseLeave;
    callbacksRef.current.mouseLeave = currentCallback;
    map.on('mouseleave', VECTOR_LAYER, currentCallback);

    // eslint-disable-next-line consistent-return
    return () => {
      if (map && !isMapRemoved(map) && currentCallback && map.off && typeof map.off === 'function') {
        try {
          map.off('mouseleave', VECTOR_LAYER, currentCallback);
        } catch (error) {
          // Silently ignore - map may be in invalid state
        }
        // Note: Not setting ref to null here - it will be overwritten on next effect run
      }
    };
  }, [map, onMouseLeave]);
};

export default useMapCallbacks;
