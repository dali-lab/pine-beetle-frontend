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
  dependencies = [],
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

    callbacksRef.current.vectorClick = onVectorClick;
    map.on('click', VECTOR_LAYER, onVectorClick);

    // eslint-disable-next-line consistent-return
    return () => {
      if (map && !isMapRemoved(map) && callbacksRef.current.vectorClick && map.off && typeof map.off === 'function') {
        try {
          map.off('click', VECTOR_LAYER, callbacksRef.current.vectorClick);
        } catch (error) {
          // Silently ignore - map may be in invalid state
        }
        callbacksRef.current.vectorClick = null;
      }
    };
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

    callbacksRef.current.hover = onHover;
    map.on('mousemove', onHover);

    // eslint-disable-next-line consistent-return
    return () => {
      if (map && !isMapRemoved(map) && callbacksRef.current.hover && map.off && typeof map.off === 'function') {
        try {
          map.off('mousemove', callbacksRef.current.hover);
        } catch (error) {
          // Silently ignore - map may be in invalid state
        }
        callbacksRef.current.hover = null;
      }
    };
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

    callbacksRef.current.stateClick = onStateClick;
    map.on('click', STATE_VECTOR_LAYER, onStateClick);

    // eslint-disable-next-line consistent-return
    return () => {
      if (map && !isMapRemoved(map) && callbacksRef.current.stateClick && map.off && typeof map.off === 'function') {
        try {
          map.off('click', STATE_VECTOR_LAYER, callbacksRef.current.stateClick);
        } catch (error) {
          // Silently ignore - map may be in invalid state
        }
        callbacksRef.current.stateClick = null;
      }
    };
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

    callbacksRef.current.mouseLeave = onMouseLeave;
    map.on('mouseleave', VECTOR_LAYER, onMouseLeave);

    // eslint-disable-next-line consistent-return
    return () => {
      if (map && !isMapRemoved(map) && callbacksRef.current.mouseLeave && map.off && typeof map.off === 'function') {
        try {
          map.off('mouseleave', VECTOR_LAYER, callbacksRef.current.mouseLeave);
        } catch (error) {
          // Silently ignore - map may be in invalid state
        }
        callbacksRef.current.mouseLeave = null;
      }
    };
  }, [map, onMouseLeave]);
};

export default useMapCallbacks;
