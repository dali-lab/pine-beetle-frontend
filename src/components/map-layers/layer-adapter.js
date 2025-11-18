import { DATA_MODES } from '../../constants';
import * as countyUtils from './county-layer-utils';
import * as rdUtils from './ranger-district-layer-utils';

/**
 * Layer adapter utilities
 * Provides a unified interface for county and ranger district operations
 */

/**
 * Gets the location field from a data item based on mode
 * @param {string} dataMode - Current data mode
 * @param {Object} dataItem - Data item
 * @returns {string} Location name
 */
export const getLocationField = (dataMode, dataItem) => {
  return dataMode === DATA_MODES.COUNTY
    ? countyUtils.getCountyField(dataItem)
    : rdUtils.getRangerDistrictField(dataItem);
};

/**
 * Formats location name for mapbox matching based on mode
 * @param {string} dataMode - Current data mode
 * @param {Object} dataItem - Data item
 * @returns {string|Array<string>} Formatted location name(s)
 */
export const formatLocationForMapbox = (dataMode, dataItem) => {
  return dataMode === DATA_MODES.COUNTY
    ? countyUtils.formatCountyForMapbox(dataItem)
    : rdUtils.formatRangerDistrictForMapbox(dataItem);
};

/**
 * Gets display name for location based on mode
 * @param {string} dataMode - Current data mode
 * @param {Object} dataItem - Data item
 * @param {string} location - Location identifier
 * @param {Array} counties - Array of county features (for RD mode fallback)
 * @returns {string} Display name
 */
export const getLocationDisplayName = (dataMode, dataItem, location, counties = []) => {
  return dataMode === DATA_MODES.COUNTY
    ? countyUtils.getCountyDisplayName(dataItem, location)
    : rdUtils.getRangerDistrictDisplayName(dataItem, location, counties);
};

/**
 * Checks if data item matches location based on mode
 * @param {string} dataMode - Current data mode
 * @param {Object} dataItem - Data item to check
 * @param {string} location - Location identifier
 * @param {string} hoverState - State abbreviation (for county mode)
 * @returns {boolean} True if matches
 */
export const matchesLocation = (dataMode, dataItem, location, hoverState) => {
  return dataMode === DATA_MODES.COUNTY
    ? countyUtils.matchesCountyLocation(dataItem, location, hoverState)
    : rdUtils.matchesRangerDistrictLocation(dataItem, location);
};
