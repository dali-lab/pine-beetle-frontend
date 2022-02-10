import { ActionTypes } from '../actions';
import { DATA_MODES, CHART_MODES } from '../../constants';

const initialState = {
  startYear: 1988,
  endYear: new Date().getFullYear(),
  predictionYear: new Date().getFullYear(),
  state: '',
  county: [],
  rangerDistrict: [],
  dataMode: DATA_MODES.COUNTY,
  chartMode: CHART_MODES.MAP,

  availableHistoricalYears: [],
  availableHistoricalStates: [],
  availableHistoricalSublocations: [],
  availablePredictionYears: [],
  availablePredictionStates: [],
  availablePredictionSublocations: [],
};


const SelectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_START_YEAR:
      return { ...state, startYear: parseInt(action.payload.startYear, 10) };

    case ActionTypes.SET_END_YEAR:
      return { ...state, endYear: parseInt(action.payload.endYear, 10) };

    case ActionTypes.SET_PREDICTION_YEAR:
      return { ...state, predictionYear: parseInt(action.payload.year, 10) };

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
      return { ...state, rangerDistrict: [action.payload.rangerDistrict] };

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
        startYear: action.payload.map(({ year }) => year).includes(state.startYear) ? parseInt(state.startYear, 10) : parseInt(Math.min(...action.payload.map(({ year }) => year)), 10),
        endYear: action.payload.map(({ year }) => year).includes(state.endYear) ? parseInt(state.endYear, 10) : parseInt(Math.max(...action.payload.map(({ year }) => year)), 10),
      };

    case ActionTypes.SET_AVAILABLE_YEARS_HISTORICAL:
      return {
        ...state,
        availableHistoricalYears: action.payload,
        startYear: action.payload.includes(state.startYear) ? parseInt(state.startYear, 10) : parseInt(Math.min(...action.payload), 10),
        endYear: action.payload.includes(state.endYear) ? parseInt(state.endYear, 10) : parseInt(Math.max(...action.payload), 10),
      };

    case ActionTypes.SET_AVAILABLE_STATES_HISTORICAL:
      return { ...state, availableHistoricalStates: action.payload };

    case ActionTypes.SET_AVAILABLE_SUBLOCATIONS_HISTORICAL:
      return { ...state, availableHistoricalSublocations: action.payload };

    case ActionTypes.SET_AVAILABLE_YEARS_PREDICTION:
      return {
        ...state,
        availablePredictionYears: action.payload,
        predictionYear: action.payload.includes(state.predictionYear) ? parseInt(state.predictionYear, 10) : parseInt(Math.max(...action.payload), 10),
      };

    case ActionTypes.SET_AVAILABLE_STATES_PREDICTION:
      return { ...state, availablePredictionStates: action.payload };

    case ActionTypes.SET_AVAILABLE_SUBLOCATIONS_PREDICTION:
      return { ...state, availablePredictionSublocations: action.payload };

    default:
      return state;
  }
};

export default SelectionsReducer;
