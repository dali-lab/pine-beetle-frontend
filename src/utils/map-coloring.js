import { MAP_SOURCE_NAME, VECTOR_LAYER } from '../constants';

const STYLE_CHECK_INTERVAL = 1000;

/**
 * Waits for map style to be loaded before proceeding with coloring
 * Uses a retry mechanism with proper cleanup to prevent race conditions
 * @param {Object} map - Mapbox map instance
 * @param {Function} colorFunction - Function to retry when style loads
 * @param {Array} colorFunctionArgs - Arguments to pass to colorFunction on retry
 * @param {Object} timeoutRef - Ref to store timeout ID for cleanup
 * @param {Object} isMountedRef - Ref to check if component is still mounted
 * @returns {boolean} True if style is loaded (continue execution), false if retry was scheduled
 */
export const waitForStyleLoad = (map, colorFunction, colorFunctionArgs, timeoutRef, isMountedRef) => {
  if (!map || !isMountedRef?.current) {
    return false;
  }

  if (!map.isStyleLoaded()) {
    if (timeoutRef?.current) {
      clearTimeout(timeoutRef.current);
    }

    const timeoutId = setTimeout(() => {
      if (isMountedRef?.current && map && colorFunction) {
        colorFunction(...colorFunctionArgs);
      }
      if (timeoutRef) {
        // eslint-disable-next-line no-param-reassign
        timeoutRef.current = null;
      }
    }, STYLE_CHECK_INTERVAL);

    if (timeoutRef) {
      // eslint-disable-next-line no-param-reassign
      timeoutRef.current = timeoutId;
    }

    return false;
  }

  return true;
};

/**
 * Removes the vector layer if it exists
 * @param {Object} map - Mapbox map instance
 */
export const removeVectorLayer = (map) => {
  if (map && map.getLayer(VECTOR_LAYER)) {
    map.removeLayer(VECTOR_LAYER);
  }
};

/**
 * Creates base fill and stroke expressions for mapbox style
 * @returns {Object} Object with fillExpression and strokeExpression arrays
 */
export const createBaseExpressions = () => {
  return {
    fillExpression: ['match', ['upcase', ['get', 'forest']]],
    strokeExpression: ['match', ['upcase', ['get', 'forest']]],
  };
};

/**
 * Adds default fallback values to expressions
 * @param {Array} fillExpression - Fill expression array
 * @param {Array} strokeExpression - Stroke expression array
 */
export const addDefaultExpressions = (fillExpression, strokeExpression) => {
  fillExpression.push('rgba(0,0,0,0)');
  strokeExpression.push('rgba(0,0,0,0)');
};

/**
 * Adds a layer to the map if the expression is valid
 * @param {Object} map - Mapbox map instance
 * @param {Array} fillExpression - Fill expression array
 * @param {Array} strokeExpression - Stroke expression array
 * @param {string} sourceLayer - Source layer name
 */
export const addMapLayer = (map, fillExpression, strokeExpression, sourceLayer) => {
  if (fillExpression.length > 3) {
    map.addLayer({
      id: VECTOR_LAYER,
      type: 'fill',
      source: MAP_SOURCE_NAME,
      'source-layer': sourceLayer,
      paint: {
        'fill-color': fillExpression,
        'fill-outline-color': strokeExpression,
      },
    }, 'water-point-label');
  }
};

/**
 * Handles location name(s) and adds them to expressions
 * Supports both single string (county) and array of strings (RD with variants)
 * @param {Array} fillExpression - Fill expression array
 * @param {Array} strokeExpression - Stroke expression array
 * @param {string|Array<string>} locationName - Location name(s) to add
 * @param {string} color - Color to use
 */
export const addLocationToExpressions = (fillExpression, strokeExpression, locationName, color) => {
  if (!locationName) return;

  const names = Array.isArray(locationName) ? locationName : [locationName];
  const validNames = names.filter((str) => !!str);

  if (validNames.length > 0) {
    validNames.forEach((name) => {
      fillExpression.push(name, color);
      strokeExpression.push(name, '#000000');
    });
  }
};
