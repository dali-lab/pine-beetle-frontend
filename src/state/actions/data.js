import { DATA_MODES } from '../../constants';
import { api } from '../../services';

export const ActionTypes = {
  SET_PREDICTIONS: 'SET_PREDICTIONS',
  SET_SPARSE_DATA: 'SET_SPARSE_DATA',
  SET_AGGREGATE_YEAR_DATA: 'SET_AGGREGATE_YEAR_DATA',
  SET_AGGREGATE_STATE_DATA: 'SET_AGGREGATE_STATE_DATA',
  SET_AGGREGATE_LOCATION_DATA: 'SET_AGGREGATE_LOCATION_DATA',
  SET_CUSTOM_PREDICTION: 'SET_CUSTOM_PREDICTION',
  SET_OBSERVED_OUTCOMES_DATA: 'SET_OBSERVED_OUTCOMES_DATA',
  SET_SCATTER_CHART_DATA: 'SET_SCATTER_CHART_DATA',

  FETCHING_PREDICTIONS: 'FETCHING_PREDICTIONS',
  FETCHING_SPARSE_DATA: 'FETCHING_SPARSE_DATA',
  FETCHING_AGGREGATE_YEAR_DATA: 'FETCHING_AGGREGATE_YEAR_DATA',
  FETCHING_AGGREGATE_STATE_DATA: 'FETCHING_AGGREGATE_STATE_DATA',
  FETCHING_AGGREGATE_LOCATION_DATA: 'FETCHING_AGGREGATE_LOCATION_DATA',
  FETCHING_CUSTOM_PREDICTION: 'FETCHING_CUSTOM_PREDICTION',
  FETCHING_OBSERVED_OUTCOMES_DATA: 'FETCHING_OBSERVED_OUTCOMES_DATA',
  FETCHING_SCATTER_CHART_DATA: 'FETCHING_SCATTER_CHART_DATA',

  SET_DATA_FETCH_ERROR: 'SET_DATA_FETCH_ERROR',
  SET_CUSTOM_PREDICTION_ERROR: 'SET_CUSTOM_PREDICTION_ERROR',
  SET_CUSTOM_RESULTS_ERROR: 'SET_CUSTOM_RESULTS_ERROR',

  CLEAR_DATA: 'CLEAR_DATA',
  CLEAR_DATA_FETCH_ERROR: 'CLEAR_DATA_FETCH_ERROR',
  CLEAR_CUSTOM_PREDICTION_ERROR: 'CLEAR_CUSTOM_PREDICTION_ERROR',
};

/**
 * @description builds filter object from selections state
 * @param {Object} selections selections state from redux
 * @param {Object} [overrides={}] optional overrides for filter values
 * @returns {Object} filter object for API calls
 */
const buildFilters = (selections, overrides = {}) => {
  const {
    county,
    endYear,
    rangerDistrict,
    startYear,
    state,
  } = selections;

  const { year, ...restOverrides } = overrides;

  const yearFilter = year
    ? { startYear: year, endYear: year }
    : { startYear: restOverrides.startYear || startYear, endYear: restOverrides.endYear || endYear };

  return {
    ...yearFilter,
    state,
    county,
    rangerDistrict,
    ...restOverrides,
  };
};

/**
 * @description action creator that fetches data with predictions for given filter
 * @param {Number} year year to fetch predictions on
 * @param {Object} [overrideFilter={}] optional filter for state, etc.
 */
export function getPredictions(year = new Date().getFullYear(), overrideFilter = {}) {
  return async (dispatch, getState) => {
    const {
      county,
      dataMode,
      rangerDistrict,
      state,
    } = getState().selections;

    const filters = Object.entries({
      year,
      state,
      county,
      rangerDistrict,
      ...overrideFilter,
      isValidForPrediction: 1,
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
          text: 'Failed to fetch predictions',
        },
      });
    } finally {
      dispatch({ type: ActionTypes.FETCHING_PREDICTIONS, payload: false });
    }
  };
}

/**
 * @description action creator for setting aggregate year data
 */
export function getSparseData(overrideFilter = {}) {
  return async (dispatch, getState) => {
    const { dataMode } = getState().selections;
    const filters = buildFilters(getState().selections, overrideFilter);

    dispatch({ type: ActionTypes.FETCHING_SPARSE_DATA, payload: true });

    try {
      const response = await (dataMode === DATA_MODES.COUNTY ? api.getSparseCountyData(filters) : api.getSparseRangerDistrictData(filters));
      dispatch({ type: ActionTypes.SET_SPARSE_DATA, payload: response });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_DATA_FETCH_ERROR,
        payload: {
          error,
          text: 'Failed to fetch sparsedata',
        },
      });
    } finally {
      dispatch({ type: ActionTypes.FETCHING_SPARSE_DATA, payload: false });
    }
  };
}

/**
 * @description action creator for fetching unsummarized (raw) trapping data
 */
export function getUnsummarizedData(overrideFilter = {}) {
  return async (dispatch, getState) => {
    const filters = buildFilters(getState().selections, overrideFilter);

    dispatch({ type: ActionTypes.FETCHING_SPARSE_DATA, payload: true });

    try {
      const response = await api.getUnsummarizedData(filters);
      dispatch({ type: ActionTypes.SET_SPARSE_DATA, payload: response });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_DATA_FETCH_ERROR,
        payload: {
          error,
          text: 'Failed to fetch unsummarized data',
        },
      });
    } finally {
      dispatch({ type: ActionTypes.FETCHING_SPARSE_DATA, payload: false });
    }
  };
}

/**
 * @description action creator for setting aggregate year data
 */
export function getAggregateYearData(overrideFilter = {}) {
  return async (dispatch, getState) => {
    const { dataMode } = getState().selections;
    const filters = buildFilters(getState().selections, overrideFilter);

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
      dispatch({ type: ActionTypes.FETCHING_AGGREGATE_YEAR_DATA, payload: false });
    }
  };
}

/**
 * @description action creator for setting aggregate state data
 */
export function getAggregateStateData(overrideFilter = {}) {
  return async (dispatch, getState) => {
    const { dataMode } = getState().selections;
    const filters = buildFilters(getState().selections, overrideFilter);

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
      dispatch({ type: ActionTypes.FETCHING_AGGREGATE_STATE_DATA, payload: false });
    }
  };
}

/**
 * @description action creator for setting aggregate location (e.g. county or RD) data
 */
export function getAggregateLocationData(overrideFilter = {}) {
  return async (dispatch, getState) => {
    const { dataMode } = getState().selections;
    const filters = buildFilters(getState().selections, overrideFilter);

    dispatch({ type: ActionTypes.FETCHING_AGGREGATE_LOCATION_DATA, payload: true });

    try {
      // Use getCountyData/getRangerDistrictData instead of aggregate endpoints
      // because aggregate endpoints don't return year field, but full data does
      const response = await (dataMode === DATA_MODES.COUNTY ? api.getCountyData(filters) : api.getRangerDistrictData(filters));

      // Extract year from filters (could be year, endYear, or predictionYear)
      const year = filters.year || filters.endYear || filters.predictionYear || null;

      dispatch({
        type: ActionTypes.SET_AGGREGATE_LOCATION_DATA,
        payload: response,
        meta: { year },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_DATA_FETCH_ERROR,
        payload: {
          error,
          text: 'Failed to fetch aggregate location data',
        },
      });
    } finally {
      dispatch({ type: ActionTypes.FETCHING_AGGREGATE_LOCATION_DATA, payload: false });
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
export function runCustomPrediction(cleridst1, spotst1, spotst2, SPB, endobrev, modelVersion) {
  return async (dispatch) => {
    dispatch({ type: ActionTypes.FETCHING_CUSTOM_PREDICTION, payload: true });

    try {
      const response = await api.runCustomPrediction(cleridst1, spotst1, spotst2, SPB, endobrev, modelVersion);
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
   * @description action creator for clearing all data
   */
export const clearData = () => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.CLEAR_DATA });
  };
};

/**
   * @description action creator for clearing all selections
   */
export const clearCustomPredictionError = () => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.CLEAR_CUSTOM_PREDICTION_ERROR });
  };
};

export const getObservedOutcomesData = (year, overrideFilter = {}) => {
  return async (dispatch, getState) => {
    if (!year) {
      return;
    }

    const {
      county,
      dataMode,
      rangerDistrict,
      state,
    } = getState().selections;

    dispatch({ type: ActionTypes.FETCHING_OBSERVED_OUTCOMES_DATA, payload: true });

    const filters = {
      state,
      county,
      rangerDistrict,
      year,
      ...overrideFilter,
    };

    try {
      const response = await (dataMode === DATA_MODES.COUNTY ? api.getCountyResultsComparison(filters) : api.getRDResultsComparison(filters));
      dispatch({ type: ActionTypes.SET_OBSERVED_OUTCOMES_DATA, payload: response });
    } catch (error) {
      dispatch({
        type: ActionTypes.CLEAR_DATA_FETCH_ERROR,
      });
      dispatch({
        type: ActionTypes.SET_DATA_FETCH_ERROR,
        payload: {
          error,
          text: 'Failed to fetch observed outcomes data',
        },
      });
    } finally {
      dispatch({ type: ActionTypes.FETCHING_OBSERVED_OUTCOMES_DATA, payload: false });
    }
  };
};

export const getScatterChartData = () => {
  return async (dispatch, getState) => {
    const {
      dataMode,
    } = getState().selections;

    const cacheKey = `scatterChart_${dataMode}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const { data: cachedScatterChart, timestamp } = JSON.parse(cachedData);
        const cacheAge = Date.now() - timestamp;
        const oneHour = 60 * 60 * 1000;
        if (cacheAge < oneHour && cachedScatterChart && cachedScatterChart.length > 0) {
          dispatch({ type: ActionTypes.SET_SCATTER_CHART_DATA, payload: cachedScatterChart });
          return;
        }
      } catch (e) {
        // Invalid cache, continue to fetch
      }
    }

    const { scatterChart } = getState().data;
    if (scatterChart && scatterChart.length > 0) {
      return;
    }

    dispatch({ type: ActionTypes.FETCHING_SCATTER_CHART_DATA, payload: true });

    try {
      const response = await (dataMode === DATA_MODES.COUNTY
        ? api.getCountyScatterChart()
        : api.getRDScatterChart());

      const chartData = Array.isArray(response) ? response : response?.data || [];
      dispatch({ type: ActionTypes.SET_SCATTER_CHART_DATA, payload: chartData });

      try {
        const cacheValue = JSON.stringify({
          data: chartData,
          timestamp: Date.now(),
        });
        localStorage.setItem(cacheKey, cacheValue);
      } catch (e) {
        // localStorage might be full, ignore
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.CLEAR_DATA_FETCH_ERROR,
      });
      dispatch({
        type: ActionTypes.SET_DATA_FETCH_ERROR,
        payload: {
          error,
          text: 'Failed to fetch scatter chart data',
        },
      });
    } finally {
      setTimeout(() => {
        dispatch({ type: ActionTypes.FETCHING_SCATTER_CHART_DATA, payload: false });
      }, 1000);
    }
  };
};

/**
 * @description fetches both observed outcomes comparison data and scatter chart data in parallel
 *              and avoids duplicate in-flight requests / unnecessary refetches
 */
export const fetchAllObservedOutcomesData = (year) => {
  return async (dispatch, getState) => {
    if (!year) {
      return;
    }

    const state = getState();
    const {
      data: {
        fetchingResultsComparisonData,
        fetchingScatterChartData,
        scatterChart,
      },
      selections: {
        dataMode,
      },
    } = state;

    if (fetchingResultsComparisonData || fetchingScatterChartData) {
      return;
    }

    const hasChartData = scatterChart && scatterChart.length > 0;

    // Fetch all data for the year - filtering is done visually on the frontend
    const filters = {
      year,
    };

    dispatch({ type: ActionTypes.FETCHING_OBSERVED_OUTCOMES_DATA, payload: true });

    if (!hasChartData) {
      dispatch({ type: ActionTypes.FETCHING_SCATTER_CHART_DATA, payload: true });
    }

    try {
      let scatterPromise;
      if (hasChartData) {
        scatterPromise = Promise.resolve(scatterChart);
      } else {
        const cacheKey = `scatterChart_${dataMode}`;
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          try {
            const { data: cachedScatterChart, timestamp } = JSON.parse(cachedData);
            const cacheAge = Date.now() - timestamp;
            const oneHour = 60 * 60 * 1000;
            if (cacheAge < oneHour && cachedScatterChart && cachedScatterChart.length > 0) {
              dispatch({ type: ActionTypes.SET_SCATTER_CHART_DATA, payload: cachedScatterChart });
              scatterPromise = Promise.resolve(cachedScatterChart);
            }
          } catch (e) {
            // ignore cache parse errors
          }
        }

        if (!scatterPromise) {
          scatterPromise = (dataMode === DATA_MODES.COUNTY
            ? api.getCountyScatterChart()
            : api.getRDScatterChart());
        }
      }

      const [mapResponse, scatterResponse] = await Promise.all([
        dataMode === DATA_MODES.COUNTY
          ? api.getCountyResultsComparison(filters)
          : api.getRDResultsComparison(filters),
        scatterPromise,
      ]);

      const chartData = Array.isArray(scatterResponse)
        ? scatterResponse
        : scatterResponse?.data || [];

      dispatch({
        type: ActionTypes.SET_OBSERVED_OUTCOMES_DATA,
        payload: mapResponse,
        meta: { year },
      });

      if (!hasChartData) {
        dispatch({ type: ActionTypes.SET_SCATTER_CHART_DATA, payload: chartData });
      }

      if (!hasChartData) {
        try {
          const cacheKey = `scatterChart_${dataMode}`;
          const cacheValue = JSON.stringify({
            data: chartData,
            timestamp: Date.now(),
          });
          localStorage.setItem(cacheKey, cacheValue);
        } catch (e) {
          // ignore cache errors
        }
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.CLEAR_DATA_FETCH_ERROR,
      });
      dispatch({
        type: ActionTypes.SET_DATA_FETCH_ERROR,
        payload: {
          error,
          text: 'Failed to fetch observed outcomes page data',
        },
      });
    } finally {
      dispatch({ type: ActionTypes.FETCHING_OBSERVED_OUTCOMES_DATA, payload: false });
      if (!hasChartData) {
        dispatch({ type: ActionTypes.FETCHING_SCATTER_CHART_DATA, payload: false });
      }
    }
  };
};
