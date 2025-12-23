/**
 * WeakMap-based tracking for removed map instances
 * Prevents memory leaks and avoids mutating external objects
 */

const removedMaps = new WeakMap();

/**
 * Checks if a map instance has been marked as removed
 * @param {Object} map - Mapbox map instance
 * @returns {boolean} True if map is marked as removed
 */
export const isMapRemoved = (map) => {
  if (!map) return true;
  return removedMaps.has(map);
};

/**
 * Marks a map instance as removed
 * @param {Object} map - Mapbox map instance
 */
export const markMapAsRemoved = (map) => {
  if (map) {
    removedMaps.set(map, true);
  }
};

/**
 * Clears the removed status for a map instance (for testing purposes)
 * @param {Object} map - Mapbox map instance
 */
export const clearMapRemoved = (map) => {
  if (map) {
    removedMaps.delete(map);
  }
};
