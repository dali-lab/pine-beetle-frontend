import { ActionTypes } from '../actions';

const initialState = {
  predictions: [], // predictions for a single year
  yearData: [], // data aggregated by year
  stateData: [], // data aggregated by state
  sublocationData: [], // data aggregated by county/ranger district
  customPrediction: {},

  fetchingPredictions: false,
  fetchingAggregateYearData: false,
  fetchingAggregateStateData: false,
  fetchingAggregateLocationData: false,
  fetchingCustomPrediction: false,
};

const DataReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_PREDICTIONS:
      return { ...state, predictions: action.payload };

    case ActionTypes.SET_AGGREGATE_YEAR_DATA:
      return { ...state, yearData: action.payload };

    case ActionTypes.SET_AGGREGATE_STATE_DATA:
      return { ...state, stateData: action.payload };

    case ActionTypes.SET_AGGREGATE_LOCATION_DATA:
      return { ...state, sublocationData: action.payload };

    case ActionTypes.SET_CUSTOM_PREDICTION:
      return { ...state, customPrediction: action.payload };

    case ActionTypes.FETCHING_PREDICTIONS:
      return { ...state, fetchingPredictions: action.payload };

    case ActionTypes.FETCHING_AGGREGATE_YEAR_DATA:
      return { ...state, fetchingAggregateYearData: action.payload };

    case ActionTypes.FETCHING_AGGREGATE_STATE_DATA:
      return { ...state, fetchingAggregateStateData: action.payload };

    case ActionTypes.FETCHING_AGGREGATE_LOCATION_DATA:
      return { ...state, fetchingAggregateLocationData: action.payload };

    case ActionTypes.FETCHING_CUSTOM_PREDICTION:
      return { ...state, fetchingCustomPrediction: action.payload };

    case ActionTypes.CLEAR_SELECTIONS:
      return { ...state, predictions: [] };

    default:
      return state;
  }
};

export default DataReducer;
