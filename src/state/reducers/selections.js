import { CHART_MODES, DATA_MODES } from '../../constants';
import { ActionTypes } from '../actions';

const initialState = {
  predictionYear: new Date().getFullYear(),
  state: '',
  county: [],
  rangerDistrict: [],
  dataMode: DATA_MODES.COUNTY,
  chartMode: CHART_MODES.GRAPH,
  predictionModal: false,

  availableHistoricalYears: [],
  availableHistoricalStates: [],
  availableHistoricalSublocations: [],
  availablePredictionYears: [],
  availablePredictionStates: [],
  availablePredictionSublocations: [],
};

const SelectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_PREDICTION_YEAR: {
      const castedYear = parseInt(action.payload.year, 10);

      // try choosing latest possible year
      const defaultYear = state.availablePredictionYears.length
        ? state.availablePredictionYears.slice(-1)
        : initialState.predictionYear;

      // guards against null, undefined, ''
      const predictionYear = Number.isNaN(castedYear)
        ? defaultYear
        : castedYear;
      return { ...state, predictionYear };
    }

    case ActionTypes.SET_STATE:
      return {
        ...state,
        state: action.payload.state,
        county: action.payload.state !== state.state ? [] : state.county,
        rangerDistrict: action.payload.state !== state.state ? [] : state.rangerDistrict,
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
        county: [],
        rangerDistrict: [],
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

    case ActionTypes.SET_AVAILABLE_YEARS_HISTORICAL:
      return {
        ...state,
        availableHistoricalYears: action.payload,
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
      if (action.payload.length !== 0) {
        return { ...state, availablePredictionStates: action.payload };
      } else {
        return state;
      }

    case ActionTypes.SET_AVAILABLE_SUBLOCATIONS_PREDICTION:
      if (action.payload.length !== 0) {
        return { ...state, availablePredictionSublocations: action.payload };
      } else {
        return state;
      }

    case ActionTypes.SET_PREDICTION_MODAL:
      return { ...state, predictionModal: action.payload };

    default:
      return state;
  }
};

export default SelectionsReducer;
