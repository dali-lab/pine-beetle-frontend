import { api } from '../../services';
import { DATA_MODES } from '../../constants';

export const ActionTypes = {
  SET_PREDICTIONS: 'SET_PREDICTIONS', // predictions for single year
  SET_AGGREGATE_YEAR_DATA: 'SET_AGGREGATE_YEAR_DATA', // data grouped by year
  SET_AGGREGATE_STATE_DATA: 'SET_AGGREGATE_STATE_DATA', // data grouped by state
  SET_AGGREGATE_LOCATION_DATA: 'SET_AGGREGATE_LOCATION_DATA', // data grouped by county/RD
  SET_CUSTOM_PREDICTION: 'SET_CUSTOM_PREDICTION',

  FETCHING_PREDICTIONS: 'FETCHING_PREDICTIONS',
  FETCHING_AGGREGATE_YEAR_DATA: 'FETCHING_AGGREGATE_YEAR_DATA',
  FETCHING_AGGREGATE_STATE_DATA: 'FETCHING_AGGREGATE_STATE_DATA',
  FETCHING_AGGREGATE_LOCATION_DATA: 'FETCHING_AGGREGATE_LOCATION_DATA',
  FETCHING_CUSTOM_PREDICTION: 'FETCHING_CUSTOM_PREDICTION',

  SET_DATA_FETCH_ERROR: 'SET_DATA_FETCH_ERROR',
  SET_CUSTOM_PREDICTION_ERROR: 'SET_CUSTOM_PREDICTION_ERROR',

  CLEAR_DATA_FETCH_ERROR: 'CLEAR_DATA_FETCH_ERROR',
  CLEAR_CUSTOM_PREDICTION_ERROR: 'CLEAR_CUSTOM_PREDICTION_ERROR',
};

export function getPredictions(year = new Date().getFullYear(), overrideFilter = {}) {
  return async (dispatch, getState) => {
    const {
      county,
      dataMode,
      rangerDistrict,
      state,
    } = getState().selections;

    const filters = Object.entries({
      startYear: year,
      endYear: year,
      state,
      county,
      rangerDistrict,
      ...overrideFilter,
    }).reduce((acc, [key, val]) => ({
      ...acc,
      ...(val ? { [key]: val } : {}),
    }), {});

    dispatch({ type: ActionTypes.FETCHING_PREDICTIONS, payload: true });

    try {
      const response = await (dataMode === DATA_MODES.COUNTY ? api.getCountyData(filters) : api.getRangerDistrictData(filters));
      dispatch({ type: ActionTypes.SET_PREDICTIONS, payload: response });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_DATA_FETCH_ERROR,
        payload: {
          error,
          text: 'Failed to fetch aggregate year data',
        },
      });
    } finally {
      setTimeout(() => {
        dispatch({ type: ActionTypes.FETCHING_PREDICTIONS, payload: false });
      }, 1000);
    }
  };
}

/**
 * @description action creator for setting aggregate year data
 */
export function getAggregateYearData(overrideFilter = {}) {
  return async (dispatch, getState) => {
    const {
      county,
      dataMode,
      endYear,
      rangerDistrict,
      startYear,
      state,
    } = getState().selections;

    const filters = {
      startYear,
      endYear,
      state,
      county,
      rangerDistrict,
      ...overrideFilter,
    };

    dispatch({ type: ActionTypes.FETCHING_AGGREGATE_YEAR_DATA, payload: true });

    try {
      const response = await (dataMode === DATA_MODES.COUNTY ? api.countyAggregateByYear(filters) : api.rangerDistrictAggregateByYear(filters));
      dispatch({ type: ActionTypes.SET_AGGREGATE_YEAR_DATA, payload: response });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_DATA_FETCH_ERROR,
        payload: {
          error,
          text: 'Failed to fetch aggregate year data',
        },
      });
    } finally {
      setTimeout(() => {
        dispatch({ type: ActionTypes.FETCHING_AGGREGATE_YEAR_DATA, payload: false });
      }, 1000);
    }
  };
}

/**
 * @description action creator for setting aggregate state data
 */
export function getAggregateStateData(overrideFilter = {}) {
  return async (dispatch, getState) => {
    const {
      county,
      dataMode,
      endYear,
      rangerDistrict,
      startYear,
      state,
    } = getState().selections;

    const filters = {
      startYear,
      endYear,
      state,
      county,
      rangerDistrict,
      ...overrideFilter,
    };

    dispatch({ type: ActionTypes.FETCHING_AGGREGATE_STATE_DATA, payload: true });

    try {
      const response = await (dataMode === DATA_MODES.COUNTY ? api.countyAggregateByState(filters) : api.rangerDistrictAggregateByState(filters));
      dispatch({ type: ActionTypes.SET_AGGREGATE_STATE_DATA, payload: response });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_DATA_FETCH_ERROR,
        payload: {
          error,
          text: 'Failed to fetch aggregate state data',
        },
      });
    } finally {
      setTimeout(() => {
        dispatch({ type: ActionTypes.FETCHING_AGGREGATE_STATE_DATA, payload: false });
      }, 1000);
    }
  };
}

/**
 * @description action creator for setting aggregate location (e.g. county or RD) data
 */
export function getAggregateLocationData(overrideFilter = {}) {
  return async (dispatch, getState) => {
    const {
      county,
      dataMode,
      endYear,
      rangerDistrict,
      startYear,
      state,
    } = getState().selections;

    const filters = {
      startYear,
      endYear,
      state,
      county,
      rangerDistrict,
      ...overrideFilter,
    };

    dispatch({ type: ActionTypes.FETCHING_AGGREGATE_LOCATION_DATA, payload: true });

    try {
      const response = await (dataMode === DATA_MODES.COUNTY ? api.countyAggregateByCounty(filters) : api.rangerDistrictAggregateByRangerDistrict(filters));
      dispatch({ type: ActionTypes.SET_AGGREGATE_LOCATION_DATA, payload: response });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_DATA_FETCH_ERROR,
        payload: {
          error,
          text: 'Failed to fetch aggregate state data',
        },
      });
    } finally {
      setTimeout(() => {
        dispatch({ type: ActionTypes.FETCHING_AGGREGATE_LOCATION_DATA, payload: false });
      }, 1000);
    }
  };
}

/**
 * @description action creator for setting custom prediction output
 * @param {Number} cleridst1 num clerids in last year
 * @param {Number} spotst1 num spots in last year
 * @param {Number} spotst2 num spots two years ago
 * @param {Number} SPB num spb this year
 * @param {Number|Boolean} endobrev whether or not endobrev was used
 */
export function runCustomPrediction(cleridst1, spotst1, spotst2, SPB, endobrev) {
  return async (dispatch) => {
    dispatch({ type: ActionTypes.FETCHING_CUSTOM_PREDICTION, payload: true });

    try {
      const response = await api.runCustomPrediction(cleridst1, spotst1, spotst2, SPB, endobrev);
      dispatch({ type: ActionTypes.SET_CUSTOM_PREDICTION, payload: response });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_CUSTOM_PREDICTION_ERROR,
        payload: {
          error,
          text: 'Failed to run custom prediction',
          input: {
            cleridst1, spotst1, spotst2, SPB, endobrev,
          },
        },
      });
    } finally {
      dispatch({ type: ActionTypes.FETCHING_CUSTOM_PREDICTION, payload: false });
    }
  };
}

/**
   * @description action creator for clearing all selections
   */
export const clearCustomPredictionError = () => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.CLEAR_CUSTOM_PREDICTION_ERROR });
  };
};
