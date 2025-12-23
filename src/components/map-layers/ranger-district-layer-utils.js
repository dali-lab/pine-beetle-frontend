import { formatRangerDistrictName, getLocationDisplayName } from '../../utils/map-mode-utils';

/**
 * Ranger District layer utilities
 * Handles ranger district-specific logic for map operations
 */

/**
 * Gets the ranger district field from a data object
 * @param {Object} dataItem - Data item with rangerDistrict
 * @returns {string} Ranger district name
 */
export const getRangerDistrictField = (dataItem) => {
  return dataItem?.rangerDistrict || '';
};

/**
 * Formats ranger district name for mapbox matching
 * Returns array of possible formats to handle tileset quirks
 * @param {Object} dataItem - Data item with rangerDistrict
 * @returns {Array<string>} Array of formatted names
 */
export const formatRangerDistrictForMapbox = (dataItem) => {
  return formatRangerDistrictName(dataItem?.rangerDistrict);
};

/**
 * Gets display name for ranger district
 * @param {Object} dataItem - Data item (may not have county)
 * @param {string} location - Location identifier (ranger district name)
 * @param {Array} counties - Array of county features from mapbox (for fallback)
 * @returns {string} Display name
 */
export const getRangerDistrictDisplayName = (dataItem, location, counties = []) => {
  // Try to get from dataItem first, then from counties array, then from location
  if (counties && counties.length > 0 && counties[0]?.properties?.forest) {
    return `${counties[0].properties.forest.slice(0, -3)} Ranger District`;
  }
  return getLocationDisplayName('RANGER_DISTRICT', null, location);
};

/**
 * Checks if data item matches ranger district location
 * @param {Object} dataItem - Data item to check
 * @param {string} location - Location identifier (ranger district name)
 * @returns {boolean} True if matches
 */
export const matchesRangerDistrictLocation = (dataItem, location) => {
  return dataItem?.rangerDistrict === location;
};
