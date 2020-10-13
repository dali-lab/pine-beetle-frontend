/* eslint-disable no-case-declarations */
import { ActionTypes } from '../actions';
import { DATA_MODES } from '../../constants';

const initialState = {
  year: new Date().getFullYear(),
  yearRange: {
    startYear: 2011,
    endYear: new Date().getFullYear(),
  },
  state: '',
  county: '',
  rangerDistrict: '',
  allStates: [],
  dataMode: DATA_MODES.COUNTY,
};

const SelectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_YEAR:
      return { ...state, year: action.payload.year };

    case ActionTypes.SET_YEAR_RANGE:
      let { startYear, endYear } = action.payload.yearRange;

      return {
        ...state,
        yearRange: {
          startYear: startYear === '' ? '' : (startYear || startYear),
          endYear: endYear === '' ? '' : (endYear || endYear),
        },
      };

    case ActionTypes.SET_STATE:
      return { ...state, state: action.payload.state };

    case ActionTypes.SET_COUNTY:
      return { ...state, county: action.payload.county };

    case ActionTypes.SET_RANGER_DISTRICT:
      return { ...state, rangerDistrict: action.payload.rangerDistrict };

    case ActionTypes.SET_ALL_STATES:
      return { ...state, allStates: action.payload };

    case ActionTypes.SET_DATA_MODE:
      const { trappingData, mode } = action.payload;

      startYear = trappingData.reduce((prev, curr) => (prev.year < curr.year ? prev : curr), {})?.year || state.yearRange.startYear;
      endYear = trappingData.reduce((prev, curr) => (prev.year > curr.year ? prev : curr), {})?.year || state.yearRange.endYear;

      return {
        ...state,
        year: endYear,
        yearRange: {
          startYear,
          endYear,
        },
        state: '',
        county: '',
        rangerDistrict: '',
        allStates: [...new Set(trappingData.map(obj => obj.state))],
        dataMode: mode,
      };

    case ActionTypes.CLEAR_SELECTIONS:
      return initialState;

    default:
      return state;
  }
};

export default SelectionsReducer;
