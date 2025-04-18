import { ActionTypes } from '../actions';

const initialState = {
  predictions: [], // predictions for a single year
  sparseData: [],
  yearData: [], // data aggregated by year
  stateData: [], // data aggregated by state
  sublocationData: [], // data aggregated by county/ranger district
  customPrediction: {},
  resultsComparison: [], // data with comparison of prediction and spots
  scatterChart: [], // data with comparison of Probability vs Log predicted units

  fetchingPredictions: false,
  fetchingSparseData: false,
  fetchingAggregateYearData: false,
  fetchingAggregateStateData: false,
  fetchingAggregateLocationData: false,
  fetchingCustomPrediction: false,
  fetchingResultsComparisonData: false,
  fetchingScatterChartData: false,
};

const DataReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_PREDICTIONS:
      return { ...state, predictions: action.payload };

    case ActionTypes.SET_SPARSE_DATA:
      return { ...state, sparseData: action.payload };

    case ActionTypes.SET_AGGREGATE_YEAR_DATA:
      return { ...state, yearData: action.payload };

    case ActionTypes.SET_AGGREGATE_STATE_DATA:
      return { ...state, stateData: action.payload };

    case ActionTypes.SET_AGGREGATE_LOCATION_DATA:
      return { ...state, sublocationData: action.payload };

    case ActionTypes.SET_CUSTOM_PREDICTION:
      return { ...state, customPrediction: action.payload };

    case ActionTypes.SET_RESULTS_COMPARISON_DATA:
      return { ...state, resultsComparison: action.payload };

    case ActionTypes.SET_SCATTER_CHART_DATA:
      return { ...state, scatterChart: action.payload };

    case ActionTypes.FETCHING_PREDICTIONS:
      return { ...state, fetchingPredictions: action.payload };

    case ActionTypes.FETCHING_SPARSE_DATA:
      return { ...state, fetchingSparseData: action.payload };

    case ActionTypes.FETCHING_AGGREGATE_YEAR_DATA:
      return { ...state, fetchingAggregateYearData: action.payload };

    case ActionTypes.FETCHING_AGGREGATE_STATE_DATA:
      return { ...state, fetchingAggregateStateData: action.payload };

    case ActionTypes.FETCHING_AGGREGATE_LOCATION_DATA:
      return { ...state, fetchingAggregateLocationData: action.payload };

    case ActionTypes.FETCHING_CUSTOM_PREDICTION:
      return { ...state, fetchingCustomPrediction: action.payload };

    case ActionTypes.FETCHING_RESULTS_COMPARISON_DATA:
      return { ...state, fetchingResultsComparisonData: action.payload };

    case ActionTypes.FETCHING_SCATTER_CHART_DATA:
      return { ...state, fetchingScatterChartData: action.payload };

    case ActionTypes.CLEAR_DATA:
      return {
        ...state,
        predictions: initialState.predictions,
        sparseData: initialState.sparseData,
        yearData: initialState.yearData,
        stateData: initialState.stateData,
        sublocationData: initialState.sublocationData,
        customPrediction: initialState.customPrediction,
        resultsComparison: initialState.resultsComparison,
      };

    case ActionTypes.CLEAR_SELECTIONS:
      return { ...state, predictions: [] };

    default:
      return state;
  }
};

export default DataReducer;
