import { ActionTypes } from '../actions';
import { DATA_MODES, CHART_MODES } from '../../constants';

const initialState = {
  startYear: 1988,
  endYear: new Date().getFullYear(),
  state: '',
  county: [],
  rangerDistrict: '',
  dataMode: DATA_MODES.COUNTY,
  chartMode: CHART_MODES.MAP,

  availableYears: [],
  availableStates: [],
  availableSublocations: [],
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
      return {
        ...state,
        dataMode: action.payload.mode,
        state: '',
        county: '',
        rangerDistrict: '',
      };

    case ActionTypes.CLEAR_SELECTIONS:
      return {
        ...initialState,
        availableYears: state.availableYears,
        availableStates: state.availableStates,
        dataMode: state.dataMode,
        chartMode: state.chartMode,
      };

    case ActionTypes.SET_CHART_MODE:
      return { ...state, chartMode: action.payload };

    case ActionTypes.SET_AGGREGATE_YEAR_DATA:
      return {
        ...state,
        startYear: Math.min(...action.payload.map(({ year }) => year)) || initialState.startYear,
        endYear: Math.max(...action.payload.map(({ year }) => year)) || initialState.endYear,
      };

    case ActionTypes.SET_AVAILABLE_YEARS:
      return {
        ...state,
        availableYears: action.payload,
        startYear: Math.min(action.payload) || initialState.startYear,
        endYear: Math.max(action.payload) || initialState.endYear,
      };

    case ActionTypes.SET_AVAILABLE_STATES:
      return { ...state, availableStates: action.payload };

    case ActionTypes.SET_AVAILABLE_SUBLOCATIONS:
      return { ...state, availableSublocations: action.payload };

    default:
      return state;
  }
};

export default SelectionsReducer;
