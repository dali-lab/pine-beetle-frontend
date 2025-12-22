import { DATA_MODES, SOURCE_LAYERS } from '../constants';
import { getMapboxRDNameFormat } from './abbreviation-mappings';

/**
 * Gets the appropriate source layer based on data mode
 * @param {string} dataMode - Current data mode (COUNTY or RANGER_DISTRICT)
 * @returns {string} Source layer name
 */
export const getSourceLayer = (dataMode) => {
  return dataMode === DATA_MODES.COUNTY ? SOURCE_LAYERS.COUNTY : SOURCE_LAYERS.RANGER_DISTRICT;
};

/**
 * Gets the location field name based on data mode
 * @param {string} dataMode - Current data mode (COUNTY or RANGER_DISTRICT)
 * @returns {string} Field name ('county' or 'rangerDistrict')
 */
export const getLocationField = (dataMode) => {
  return dataMode === DATA_MODES.COUNTY ? 'county' : 'rangerDistrict';
};

/**
 * Formats county name for mapbox matching
 * @param {string} countyName - County name
 * @param {string} state - State abbreviation
 * @returns {string} Formatted county name
 */
export const formatCountyName = (countyName, state) => {
  if (!countyName || !state) return '';
  return `${countyName.toUpperCase()} ${state}`;
};

/**
 * Formats ranger district name for mapbox matching
 * Handles edge cases where tileset has formatting quirks
 * @param {string} rangerDistrictName - Ranger district name
 * @returns {Array<string>} Array of possible formatted names to match
 */
export const formatRangerDistrictName = (rangerDistrictName) => {
  if (!rangerDistrictName) return [];
  const formatted = getMapboxRDNameFormat(rangerDistrictName).toUpperCase();
  return [
    formatted,
    formatted.replace(' RD', '  RD'),
    formatted.replace(' RD', ''),
  ].filter((str) => !!str);
};

/**
 * Gets formatted location name(s) based on data mode
 * @param {string} dataMode - Current data mode
 * @param {string} countyName - County name (if county mode)
 * @param {string} state - State abbreviation
 * @param {string} rangerDistrictName - Ranger district name (if RD mode)
 * @returns {string|Array<string>} Formatted location name(s)
 */
export const getLocationName = (dataMode, countyName, state, rangerDistrictName) => {
  if (dataMode === DATA_MODES.COUNTY) {
    return formatCountyName(countyName, state);
  }
  return formatRangerDistrictName(rangerDistrictName);
};

/**
 * Gets display name for location (for tooltips, etc.)
 * @param {string} dataMode - Current data mode
 * @param {string} countyName - County name
 * @param {string} location - Location identifier (county or RD)
 * @returns {string} Display name
 */
export const getLocationDisplayName = (dataMode, countyName, location) => {
  if (dataMode === DATA_MODES.COUNTY) {
    return `${countyName} County`;
  }
  return `${getMapboxRDNameFormat(location).slice(0, -3)} Ranger District`;
};

/**
 * Formats location for mapbox matching based on data mode
 * Takes a data item object and returns formatted name(s) for mapbox
 * @param {string} dataMode - Current data mode
 * @param {Object} dataItem - Data item with county, rangerDistrict, and state properties
 * @returns {string|Array<string>} Formatted location name(s)
 */
export const formatLocationForMapbox = (dataMode, dataItem) => {
  if (!dataItem) return null;

  if (dataMode === DATA_MODES.COUNTY) {
    return formatCountyName(dataItem.county, dataItem.state);
  }
  return formatRangerDistrictName(dataItem.rangerDistrict);
};
