import { formatCountyName, getLocationDisplayName } from '../../utils/map-mode-utils';

/**
 * County layer utilities
 * Handles county-specific logic for map operations
 */

/**
 * Gets the county field from a data object
 * @param {Object} dataItem - Data item with county and state
 * @returns {string} County name
 */
export const getCountyField = (dataItem) => {
  return dataItem?.county || '';
};

/**
 * Formats county name for mapbox matching
 * @param {Object} dataItem - Data item with county and state
 * @returns {string} Formatted county name
 */
export const formatCountyForMapbox = (dataItem) => {
  return formatCountyName(dataItem?.county, dataItem?.state);
};

/**
 * Gets display name for county
 * @param {Object} dataItem - Data item with county name
 * @param {string} location - Location identifier (county name)
 * @returns {string} Display name
 */
export const getCountyDisplayName = (dataItem, location) => {
  return getLocationDisplayName('COUNTY', dataItem?.county || location, location);
};

/**
 * Checks if data item matches county location
 * @param {Object} dataItem - Data item to check
 * @param {string} location - Location identifier (county name)
 * @param {string} hoverState - State abbreviation
 * @returns {boolean} True if matches
 */
export const matchesCountyLocation = (dataItem, location, hoverState) => {
  return dataItem?.county === location && dataItem?.state === hoverState;
};
