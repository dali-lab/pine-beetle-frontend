import { DATA_MODES } from '../../constants';

/**
 * @description returns full unfiltered data array depending on mode
 * @param {String} mode data mode
 * @param {Object} state reducer state
 */
export const getFullDataArray = (mode, state) => {
  return mode === DATA_MODES.COUNTY ? state.county : state.rangerDistrict;
};

/**
 * @description filters array of objects based on location filters
 * @param {Array<Object>} array array of objects to filter
 * @param {Object} action redux action
 */
export const filterLocation = (array, action) => (
  array.filter((obj) => {
    const {
      state: stateSelection, county, rangerDistrict, dataMode,
    } = action.payload;

    const sublocation = dataMode === DATA_MODES.COUNTY ? county : rangerDistrict;

    if (stateSelection && sublocation) {
      return obj.state === stateSelection && (obj.county === sublocation || obj.rangerDistrict === sublocation);
    } else if (stateSelection) {
      return obj.state === stateSelection;
    } else if (sublocation) {
      return obj.county === sublocation || obj.rangerDistrict === sublocation;
    } else {
      return true;
    }
  })
);

/**
 * @description filters array of objects based on year filter
 * @param {Array<Object>} array array of objects to filter
 * @param {Object} action redux action
 */
export const filterYear = (array, action) => (
  array.filter((obj) => {
    const { year } = action.payload;

    if (year) {
      return obj.year === year;
    } else {
      return true;
    }
  })
);

/**
 * @description filters array of objects based on year range filters
 * @param {Array<Object>} array array of objects to filter
 * @param {Object} action redux action
 */
export const filterYearRange = (array, action) => (
  array.filter((obj) => {
    const { startYear, endYear } = action.payload.yearRange;

    if (startYear && endYear) {
      return obj.year >= startYear && obj.year <= endYear;
    } else if (startYear) {
      return obj.year >= startYear;
    } else if (endYear) {
      return obj.year <= endYear;
    } else {
      return true;
    }
  })
);
