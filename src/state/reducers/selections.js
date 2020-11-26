/* eslint-disable no-case-declarations */
import { ActionTypes } from '../actions';
import { DATA_MODES, CHART_MODES } from '../../constants';

const initialState = {
  year: new Date().getFullYear(),
  yearRange: {
    startYear: 2010,
    endYear: new Date().getFullYear(),
  },
  state: '',
  county: '',
  rangerDistrict: '',
  dataMode: DATA_MODES.COUNTY,
  chartMode: CHART_MODES.GRAPH,
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
          startYear: startYear === '' ? '' : (startYear || state.yearRange.startYear),
          endYear: endYear === '' ? '' : (endYear || state.yearRange.endYear),
        },
      };

    case ActionTypes.SET_STATE:
      return { ...state, state: action.payload.state };

    case ActionTypes.SET_COUNTY:
      return { ...state, county: action.payload.county };

    case ActionTypes.SET_RANGER_DISTRICT:
      return { ...state, rangerDistrict: action.payload.rangerDistrict };

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
        dataMode: mode,
      };

    case ActionTypes.CLEAR_SELECTIONS:
      const year = action.payload.trappingData.reduce((prev, curr) => (
        prev.year > curr.year ? prev : curr
      ), {})?.year || state.yearRange.endYear;

      return {
        ...initialState,
        year,
      };

    case ActionTypes.SET_CHART_MODE:
      return { ...state, chartMode: action.payload };

    default:
      return state;
  }
};

export default SelectionsReducer;
