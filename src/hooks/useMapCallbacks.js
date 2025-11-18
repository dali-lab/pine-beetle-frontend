import { useEffect, useRef } from 'react';
import { STATE_VECTOR_LAYER, VECTOR_LAYER } from '../constants';

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

  // Vector layer click callback
  useEffect(() => {
    if (!map || !onVectorClick) {
      return;
    }

    // Remove previous callback if exists
    const previousCallback = callbacksRef.current.vectorClick;
    if (previousCallback) {
      map.off('click', VECTOR_LAYER, previousCallback);
    }

    // Set new callback
    callbacksRef.current.vectorClick = onVectorClick;
    map.on('click', VECTOR_LAYER, onVectorClick);

    // eslint-disable-next-line consistent-return
    return () => {
      if (map && callbacksRef.current.vectorClick) {
        map.off('click', VECTOR_LAYER, callbacksRef.current.vectorClick);
        callbacksRef.current.vectorClick = null;
      }
    };
  }, [map, onVectorClick, ...dependencies]);

  // Hover callback
  useEffect(() => {
    if (!map || !onHover) {
      return;
    }

    // Remove previous callback if exists
    const previousCallback = callbacksRef.current.hover;
    if (previousCallback) {
      map.off('mousemove', previousCallback);
    }

    // Set new callback
    callbacksRef.current.hover = onHover;
    map.on('mousemove', onHover);

    // eslint-disable-next-line consistent-return
    return () => {
      if (map && callbacksRef.current.hover) {
        map.off('mousemove', callbacksRef.current.hover);
        callbacksRef.current.hover = null;
      }
    };
  }, [map, onHover, ...dependencies]);

  // State click callback
  useEffect(() => {
    if (!map || !onStateClick) {
      return;
    }

    // Remove previous callback if exists
    const previousCallback = callbacksRef.current.stateClick;
    if (previousCallback) {
      map.off('click', STATE_VECTOR_LAYER, previousCallback);
    }

    // Set new callback
    callbacksRef.current.stateClick = onStateClick;
    map.on('click', STATE_VECTOR_LAYER, onStateClick);

    // eslint-disable-next-line consistent-return
    return () => {
      if (map && callbacksRef.current.stateClick) {
        map.off('click', STATE_VECTOR_LAYER, callbacksRef.current.stateClick);
        callbacksRef.current.stateClick = null;
      }
    };
  }, [map, onStateClick, ...dependencies]);

  // Mouse leave callback
  useEffect(() => {
    if (!map || !onMouseLeave) {
      return;
    }

    // Remove previous callback if exists
    const previousCallback = callbacksRef.current.mouseLeave;
    if (previousCallback) {
      map.off('mouseleave', VECTOR_LAYER, previousCallback);
    }

    // Set new callback
    callbacksRef.current.mouseLeave = onMouseLeave;
    map.on('mouseleave', VECTOR_LAYER, onMouseLeave);

    // eslint-disable-next-line consistent-return
    return () => {
      if (map && callbacksRef.current.mouseLeave) {
        map.off('mouseleave', VECTOR_LAYER, callbacksRef.current.mouseLeave);
        callbacksRef.current.mouseLeave = null;
      }
    };
  }, [map, onMouseLeave]);
};

export default useMapCallbacks;
