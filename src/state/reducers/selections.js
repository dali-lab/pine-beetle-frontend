/* eslint-disable no-case-declarations */
import { ActionTypes } from '../actions';
import { DATA_MODES, CHART_MODES } from '../../constants';

const initialState = {
  startYear: 1988,
  endYear: new Date().getFullYear(),
  state: '',
  county: '',
  rangerDistrict: '',
  dataMode: DATA_MODES.COUNTY,
  chartMode: CHART_MODES.GRAPH,
};

const SelectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_YEAR:
      return { ...state, startYear: action.payload.year, endYear: action.payload.year };

    case ActionTypes.SET_START_YEAR:
      return { ...state, startYear: action.payload.startYear };

    case ActionTypes.SET_END_YEAR:
      return { ...state, endYear: action.payload.endYear };

    case ActionTypes.SET_STATE:
      return {
        ...state,
        state: action.payload.state,
        county: action.payload.state !== state.state ? '' : state.county,
        rangerDistrict: action.payload.state !== state.state ? '' : state.rangerDistrict,
      };

    case ActionTypes.SET_COUNTY:
      return { ...state, county: action.payload.county };

    case ActionTypes.SET_RANGER_DISTRICT:
      return { ...state, rangerDistrict: action.payload.rangerDistrict };

    case ActionTypes.SET_DATA_MODE:
      const {
        mode,
        state: newState,
        startYear,
        endYear,
      } = action.payload;

      return {
        ...state,
        startYear,
        endYear,
        state: newState,
        county: '',
        rangerDistrict: '',
        dataMode: mode,
      };

    case ActionTypes.CLEAR_SELECTIONS:
      const {
        startYear: dataStartYear,
        endYear: dataEndYear,
      } = action.payload.data.reduce((prev, curr) => ({
        startYear: (!prev.startYear || prev.startYear > curr.year) ? curr.year : prev.startYear,
        endYear: (!prev.endYear || prev.endYear < curr.year) ? curr.year : prev.endYear,
      }), { startYear: null, endYear: null });

      return {
        ...initialState,
        startYear: dataStartYear,
        endYear: dataEndYear,
        dataMode: state.dataMode,
        chartMode: state.chartMode,
      };

    case ActionTypes.SET_CHART_MODE:
      return { ...state, chartMode: action.payload };

    default:
      return state;
  }
};

export default SelectionsReducer;
