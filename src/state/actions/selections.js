import {
  clearData,
  getAggregateLocationData,
  getAggregateStateData,
  getAggregateYearData,
  getPredictions,
  getResultsComparisonData,
  getSparseData,
} from './data';

import {
  setDataModeInStorage,
} from '../../utils';

import { api } from '../../services';

export const ActionTypes = {
  SET_PREDICTION_YEAR: 'SET_PREDICTION_YEAR',
  SET_START_YEAR: 'SET_START_YEAR',
  SET_END_YEAR: 'SET_END_YEAR',
  SET_STATE: 'SET_STATE',
  SET_COUNTY: 'SET_COUNTY',
  SET_COUNTY_FILTER: 'SET_COUNTY_FILTER',
  SET_RANGER_DISTRICT: 'SET_RANGER_DISTRICT',
  SET_RANGER_DISTRICT_FILTER: 'SET_RANGER_DISTRICT_FILTER',
  CLEAR_SELECTIONS: 'CLEAR_SELECTIONS',
  SET_ALL_STATES: 'SET_ALL_STATES',
  SET_ALL_COUNTIES: 'SET_ALL_COUNTIES',
  SET_ALL_RANGER_DISTRICTS: 'SET_ALL_RANGER_DISTRICTS',
  SET_DATA_MODE: 'SET_DATA_MODE',
  SET_CHART_MODE: 'SET_CHART_MODE',
  SET_DATA_FETCH_ERROR: 'SET_DATA_FETCH_ERROR',

  SET_AVAILABLE_YEARS_HISTORICAL: 'SET_AVAILABLE_YEARS_HISTORICAL',
  SET_AVAILABLE_STATES_HISTORICAL: 'SET_AVAILABLE_STATES_HISTORICAL',
  SET_AVAILABLE_SUBLOCATIONS_HISTORICAL: 'SET_AVAILABLE_SUBLOCATIONS_HISTORICAL',
  SET_AVAILABLE_YEARS_PREDICTION: 'SET_AVAILABLE_YEARS_PREDICTION',
  SET_AVAILABLE_STATES_PREDICTION: 'SET_AVAILABLE_STATES_PREDICTION',
  SET_AVAILABLE_SUBLOCATIONS_PREDICTION: 'SET_AVAILABLE_SUBLOCATIONS_PREDICTION',

  SET_PREDICTION_MODAL: 'SET_PREDICTION_MODAL',
};

/**
 * @description action creator for fetching available years in data
 * @param {Object} [overrideFilter={}] optional filter to override selection values in redux
 */
export function getAvailableYears(overrideFilter = {}) {
  return async (dispatch, getState) => {
    const {
      county,
      dataMode,
      rangerDistrict,
      state,
    } = getState().selections;

    const filters = {
      state,
      county,
      rangerDistrict,
      ...overrideFilter,
    };

    try {
      const historicalYears = await api.getAvailableYears(dataMode, { ...filters, isHistorical: true });
      const predictionYears = await api.getAvailableYears(dataMode, { ...filters, isPrediction: true });

      dispatch({ type: ActionTypes.SET_AVAILABLE_YEARS_HISTORICAL, payload: historicalYears });
      dispatch({ type: ActionTypes.SET_AVAILABLE_YEARS_PREDICTION, payload: predictionYears });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_DATA_FETCH_ERROR,
        payload: {
          error,
          text: 'Failed to fetch available years',
        },
      });
    }
  };
}

/**
 * @description action creator for fetching available states in data
 * @param {Object} [overrideFilter={}] optional filter to override selection values in redux
 * @param {Object} [levels={}] optional ability to not query on historical or prediction levels
 */
export function getAvailableStates(overrideFilter = {}, { historical = true, prediction = true } = {}) {
  return async (dispatch, getState) => {
    const {
      dataMode,
      predictionYear,
    } = getState().selections;

    const filters = {
      predictionYear,
      ...overrideFilter,
    };

    try {
      if (historical) {
        const historicalStates = await api.getAvailableStates(dataMode, { ...filters, isHistorical: true });
        dispatch({ type: ActionTypes.SET_AVAILABLE_STATES_HISTORICAL, payload: historicalStates });
      }

      if (prediction) {
        const predictionStates = await api.getAvailableStates(dataMode, {
          ...filters,
          isPrediction: true,
        });
        dispatch({ type: ActionTypes.SET_AVAILABLE_STATES_PREDICTION, payload: predictionStates });
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_DATA_FETCH_ERROR,
        payload: {
          error,
          text: 'Failed to fetch available states',
        },
      });
    }
  };
}

/**
 * @description action creator for fetching available sublocations in data
 * @param {Object} [overrideFilter={}] optional filter to override selection values in redux
 * @param {Object} [levels={}] optional ability to not query on historical or prediction levels
 */
export function getAvailableSublocations(state, overrideFilter = {}, { historical = true, prediction = true } = {}) {
  return async (dispatch, getState) => {
    const {
      dataMode,
      predictionYear,
    } = getState().selections;

    const filters = {
      predictionYear,
      ...overrideFilter,
      state,
    };

    try {
      if (historical) {
        const historicalSublocations = await api.getAvailableSublocations(dataMode, { ...filters, isHistorical: true });
        dispatch({ type: ActionTypes.SET_AVAILABLE_SUBLOCATIONS_HISTORICAL, payload: historicalSublocations });
      }

      if (prediction) {
        const predictionSublocations = await api.getAvailableSublocations(dataMode, {
          ...filters,
          isPrediction: true,
        });

        dispatch({ type: ActionTypes.SET_AVAILABLE_SUBLOCATIONS_PREDICTION, payload: predictionSublocations });
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_DATA_FETCH_ERROR,
        payload: {
          error,
          text: 'Failed to fetch available sublocations',
        },
      });
    }
  };
}

/**
 * @description action creator for setting prediction year
 * @param {Number} year year to set
 */
export const setPredictionYear = (year) => {
  return (dispatch, getState) => {
    const { state } = getState().selections;

    dispatch({ type: ActionTypes.SET_PREDICTION_YEAR, payload: { year } });

    dispatch(getPredictions(year));

    // fetch new drop down values
    dispatch(getAvailableStates({
      predictionYear: year,
    }, { historical: false }));

    if (state) {
      dispatch(getAvailableSublocations(state, {
        predictionYear: year,
      }, { historical: false }));
    }
  };
};

/**
 * @description action creator for setting start year
 * @param {Number} year year to set as start year
 */
export const setStartYear = (year) => {
  return (dispatch, getState) => {
    dispatch({ type: ActionTypes.SET_START_YEAR, payload: { year } });

    // Fetch new data with updated start year filter
    dispatch(getAggregateYearData({ startYear: year }));
  };
};

/**
 * @description action creator for setting end year
 * @param {Number} year year to set as end year
 */
export const setEndYear = (year) => {
  return (dispatch, getState) => {
    dispatch({ type: ActionTypes.SET_END_YEAR, payload: { year } });

    // Fetch new data with updated end year filter
    dispatch(getAggregateYearData({ endYear: year }));
  };
};

/**
 * @description action creator for selecting from first year till onwards
 */
export const setAllYears = () => {
  return (dispatch, getState) => {
    const { availablePredictionYears, state } = getState().selections;

    const year = Math.max(...availablePredictionYears);

    dispatch({ type: ActionTypes.SET_PREDICTION_YEAR, payload: { year } });

    // clear out existing data
    dispatch(clearData());

    // fetch new data
    dispatch(getSparseData({ year }));
    dispatch(getAggregateYearData({ year }));
    dispatch(getAggregateStateData({ year }));
    dispatch(getAggregateLocationData({ year }));
    dispatch(getPredictions(year));

    // fetch new drop down values
    dispatch(getAvailableStates({ predictionYear: year }));
    if (state) { dispatch(getAvailableSublocations(state, { predictionYear: year })); }
  };
};

/**
 * @description action creator for setting state
 * @param {String} state state abbreviation
 */
export const setState = (state) => {
  return (dispatch, getState) => {
    dispatch({ type: ActionTypes.SET_STATE, payload: { state } });

    // clear out existing data
    dispatch(clearData());

    // fetch new data
    dispatch(getSparseData({ state }));
    dispatch(getAggregateYearData({ state }));
    dispatch(getAggregateStateData({ state }));
    dispatch(getAggregateLocationData({ state }));

    const { predictionYear } = getState().selections;
    dispatch(getPredictions(predictionYear), { state });
    dispatch(getResultsComparisonData(predictionYear, { state }));

    // fetch new drop down values
    dispatch(getAvailableYears({ state }));
    dispatch(getAvailableSublocations(state));
  };
};

/**
 * @description action creator for setting county
 * @param {String} newCounty county name
 */
export const setCounty = (newCounty) => {
  return (dispatch, getState) => {
    const county = newCounty === '' // guard against emptystring from input
      ? []
      : newCounty;
    dispatch({ type: ActionTypes.SET_COUNTY, payload: { county } });

    // clear out existing data
    dispatch(clearData());

    // fetch new data
    dispatch(getSparseData({ county }));
    dispatch(getAggregateYearData({ county }));
    dispatch(getAggregateStateData({ county }));
    dispatch(getAggregateLocationData({ county }));

    const { predictionYear } = getState().selections;
    dispatch(getPredictions(predictionYear), { county });
    dispatch(getResultsComparisonData(predictionYear, { county }));

    // fetch new drop down values
    dispatch(getAvailableYears({ county }));
  };
};

/**
 * @description action creator for setting ranger district
 * @param {String} newRangerDistrict ranger district name
 */
export const setRangerDistrict = (newRangerDistrict) => {
  return (dispatch, getState) => {
    const rangerDistrict = newRangerDistrict === '' // guard against emptystring from input
      ? []
      : newRangerDistrict;
    dispatch({ type: ActionTypes.SET_RANGER_DISTRICT, payload: { rangerDistrict } });

    // clear out existing data
    dispatch(clearData());

    // fetch new data
    dispatch(getSparseData({ rangerDistrict }));
    dispatch(getAggregateYearData({ rangerDistrict }));
    dispatch(getAggregateStateData({ rangerDistrict }));
    dispatch(getAggregateLocationData({ rangerDistrict }));
    const { predictionYear } = getState().selections;
    dispatch(getPredictions(predictionYear), { rangerDistrict });
    dispatch(getResultsComparisonData(predictionYear, { rangerDistrict }));

    // fetch new drop down values
    dispatch(getAvailableYears({ rangerDistrict }));
  };
};

/**
 * @description action creator for setting county filter (without fetching data)
 * Used for filtering map visualization without reloading
 * @param {Array} newCounty county names array
 */
export const setCountyFilter = (newCounty) => {
  return (dispatch) => {
    const county = newCounty === '' // guard against emptystring from input
      ? []
      : newCounty;
    dispatch({ type: ActionTypes.SET_COUNTY_FILTER, payload: { county } });
  };
};

/**
 * @description action creator for setting ranger district filter (without fetching data)
 * Used for filtering map visualization without reloading
 * @param {Array} newRangerDistrict ranger district names array
 */
export const setRangerDistrictFilter = (newRangerDistrict) => {
  return (dispatch) => {
    const rangerDistrict = newRangerDistrict === '' // guard against emptystring from input
      ? []
      : newRangerDistrict;
    dispatch({ type: ActionTypes.SET_RANGER_DISTRICT_FILTER, payload: { rangerDistrict } });
  };
};

/**
 * @description action creator for clearing all selections
 */
export const clearSelections = () => {
  return (dispatch, getState) => {
    dispatch({ type: ActionTypes.CLEAR_SELECTIONS });

    // clear out existing data
    dispatch(clearData());

    // Get the updated state after clearing (predictionYear will be reset to latest available)
    const { predictionYear } = getState().selections;

    // fetch new data (without state filter - will show all states on map)
    dispatch(getSparseData());
    dispatch(getAggregateYearData());
    dispatch(getAggregateStateData());
    dispatch(getAggregateLocationData());
    dispatch(getPredictions(predictionYear));
    dispatch(getResultsComparisonData(predictionYear));

    // fetch new selection criteria
    dispatch(getAvailableYears());
    dispatch(getAvailableStates());
    dispatch({ type: ActionTypes.SET_AVAILABLE_SUBLOCATIONS_HISTORICAL, payload: [] });
    dispatch({ type: ActionTypes.SET_AVAILABLE_SUBLOCATIONS_PREDICTION, payload: [] });
  };
};

/**
 * @description action creator for setting data mode
 * @param {String} mode data mode
 */
export const setDataMode = (mode) => {
  return (dispatch, getState) => {
    setDataModeInStorage(mode);
    dispatch({ type: ActionTypes.SET_DATA_MODE, payload: { mode } });

    // clear out existing data
    dispatch(clearData());

    // fetch new data
    dispatch(getSparseData());
    dispatch(getAggregateYearData());
    dispatch(getAggregateStateData());
    dispatch(getAggregateLocationData());
    const { predictionYear } = getState().selections;
    dispatch(getPredictions(predictionYear));
    dispatch(getResultsComparisonData(predictionYear));

    // fetch new selection criteria
    dispatch(getAvailableYears());
    dispatch(getAvailableStates());
    dispatch({ type: ActionTypes.SET_AVAILABLE_SUBLOCATIONS_HISTORICAL, payload: [] });
    dispatch({ type: ActionTypes.SET_AVAILABLE_SUBLOCATIONS_PREDICTION, payload: [] });
  };
};

/**
 * @description action creator for setting chart mode
 * @param {String} mode chart mode
 */
export const setChartMode = (mode) => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.SET_CHART_MODE, payload: mode });
  };
};

export const setPredictionModal = (show) => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.SET_PREDICTION_MODAL, payload: show });
  };
};
