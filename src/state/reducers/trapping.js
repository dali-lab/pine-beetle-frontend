/* eslint-disable no-case-declarations */
import { ActionTypes } from '../actions';
import { DATA_MODES } from '../../constants';

const initialState = {
  data: [], // current data (changes when user updates data mode, components should import this)
  county: [], // the county data
  rangerDistrict: [], // the ranger district data

  fetchingCounty: false,
  fetchingRangerDistrict: false,
};

const getFullDataArray = (mode, state) => {
  return mode === DATA_MODES.COUNTY ? state.county : state.rangerDistrict;
};

const filterLocation = (array, action) => (
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

const filterYearRange = (array, action) => (
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

const TrappingReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_COUNTY_TRAPPING:
      return { ...state, county: action.payload };

    case ActionTypes.SET_RANGER_DISTRICT_TRAPPING:
      return { ...state, rangerDistrict: action.payload };

    case ActionTypes.FETCHING_COUNTY_TRAPPING:
      return { ...state, fetchingCounty: action.payload };

    case ActionTypes.FETCHING_RANGER_DISTRICT_TRAPPING:
      return { ...state, fetchingRangerDistrict: action.payload };

    case ActionTypes.SET_DATA_MODE:
      return { ...state, data: action.payload === DATA_MODES.COUNTY ? state.county : state.rangerDistrict };

    case ActionTypes.SET_YEAR:
      return {
        ...state,
        data: filterLocation(getFullDataArray(action.payload.dataMode, state).filter(obj => (
          obj.year === action.payload.year
        ))),
      };

    case ActionTypes.SET_YEAR_RANGE:
      return {
        ...state,
        data: filterYearRange(filterLocation(getFullDataArray(action.payload.dataMode, state), action), action),
      };

    case ActionTypes.SET_STATE:
      const filteredData = filterYearRange(getFullDataArray(action.payload.dataMode, state), action).filter((obj) => {
        if (action.payload.state.length > 0) {
          return obj.state === action.payload.state;
        } else {
          return true;
        }
      });

      return {
        ...state,
        data: filteredData,
      };

    case ActionTypes.SET_COUNTY:
      if (action.payload.dataMode !== DATA_MODES.COUNTY) return state;

      return {
        ...state,
        data: filterYearRange(getFullDataArray(action.payload.dataMode, state), action).filter((obj) => {
          if (action.payload.county.length > 0) {
            return obj.state === action.payload.state && obj.county === action.payload.county;
          } else {
            return obj.state === action.payload.state;
          }
        }),
      };

    case ActionTypes.SET_RANGER_DISTRICT:
      if (action.payload.dataMode !== DATA_MODES.RANGER_DISTRICT) return state;

      return {
        ...state,
        data: filterYearRange(getFullDataArray(action.payload.dataMode, state), action).filter((obj) => {
          if (action.payload.county.length > 0) {
            return obj.state === action.payload.state && obj.rangerDistrict === action.payload.county;
          } else {
            return obj.state === action.payload.state;
          }
        }),
      };

    default:
      return state;
  }
};

export default TrappingReducer;
