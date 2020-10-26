/* eslint-disable no-case-declarations */
import { ActionTypes } from '../actions';
import { DATA_MODES } from '../../constants';

import {
  getFullDataArray,
  filterLocation,
  filterYear,
} from './utils';

const initialState = {
  data: [], // current data (changes when user updates data mode, components should import this)
  county: [], // the county data
  rangerDistrict: [], // the ranger district data

  fetchingCounty: false,
  fetchingRangerDistrict: false,
};

const PredictionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_COUNTY_PREDICTIONS:
      return { ...state, county: action.payload };

    case ActionTypes.SET_RANGER_DISTRICT_PREDICTIONS:
      return { ...state, rangerDistrict: action.payload };

    case ActionTypes.FETCHING_COUNTY_PREDICTIONS:
      return { ...state, fetchingCounty: action.payload };

    case ActionTypes.FETCHING_RANGER_DISTRICT_PREDICTIONS:
      return { ...state, fetchingRangerDistrict: action.payload };

    case ActionTypes.SET_DATA_MODE:
      return { ...state, data: action.payload.mode === DATA_MODES.COUNTY ? state.county : state.rangerDistrict };

    case ActionTypes.SET_YEAR:
      return {
        ...state,
        data: filterLocation(getFullDataArray(action.payload.dataMode, state).filter(obj => (
          obj.year === action.payload.year
        )), action),
      };

    case ActionTypes.SET_YEAR_RANGE:
      return state;

      // keeping this in case we want predictions to filter on year range (likely not)
      // return {
      //   ...state,
      //   data: filterYear(filterLocation(getFullDataArray(action.payload.dataMode, state), action), action),
      // };

    case ActionTypes.SET_STATE:
      const filteredData = filterYear(getFullDataArray(action.payload.dataMode, state), action).filter((obj) => {
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
        data: filterYear(getFullDataArray(action.payload.dataMode, state), action).filter((obj) => {
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
        data: filterYear(getFullDataArray(action.payload.dataMode, state), action).filter((obj) => {
          if (action.payload.rangerDistrict.length > 0) {
            return obj.state === action.payload.state && obj.rangerDistrict === action.payload.rangerDistrict;
          } else {
            return obj.state === action.payload.state;
          }
        }),
      };

    case ActionTypes.CLEAR_SELECTIONS:
      return { ...state, data: action.payload === DATA_MODES.COUNTY ? state.county : state.rangerDistrict };

    default:
      return state;
  }
};

export default PredictionsReducer;
