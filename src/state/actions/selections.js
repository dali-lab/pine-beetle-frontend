import {
  clearData,
  getAggregateYearData,
  getAggregateStateData,
  getAggregateLocationData,
  getPredictions,
} from './data';

import {
  setChartModeInStorage,
  setDataModeInStorage,
} from '../../utils';

import { api } from '../../services';

export const ActionTypes = {
  SET_START_YEAR: 'SET_START_YEAR',
  SET_END_YEAR: 'SET_END_YEAR',
  SET_PREDICTION_YEAR: 'SET_PREDICTION_YEAR',
  SET_STATE: 'SET_STATE',
  SET_COUNTY: 'SET_COUNTY',
  SET_RANGER_DISTRICT: 'SET_RANGER_DISTRICT',
  CLEAR_SELECTIONS: 'CLEAR_SELECTIONS',
  SET_ALL_STATES: 'SET_ALL_STATES',
  SET_ALL_COUNTIES: 'SET_ALL_COUNTIES',
  SET_ALL_RANGER_DISTRICTS: 'SET_ALL_RANGER_DISTRICTS',
  SET_DATA_MODE: 'SET_DATA_MODE',
  SET_CHART_MODE: 'SET_CHART_MODE',

  SET_AVAILABLE_YEARS_HISTORICAL: 'SET_AVAILABLE_YEARS_HISTORICAL',
  SET_AVAILABLE_STATES_HISTORICAL: 'SET_AVAILABLE_STATES_HISTORICAL',
  SET_AVAILABLE_SUBLOCATIONS_HISTORICAL: 'SET_AVAILABLE_SUBLOCATIONS_HISTORICAL',
  SET_AVAILABLE_YEARS_PREDICTION: 'SET_AVAILABLE_YEARS_PREDICTION',
  SET_AVAILABLE_STATES_PREDICTION: 'SET_AVAILABLE_STATES_PREDICTION',
  SET_AVAILABLE_SUBLOCATIONS_PREDICTION: 'SET_AVAILABLE_SUBLOCATIONS_PREDICTION',
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
      endYear,
      startYear,
      predictionYear,
    } = getState().selections;

    const filters = {
      startYear,
      endYear,
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
          startYear: predictionYear,
          endYear: predictionYear,
        });
        dispatch({ type: ActionTypes.SET_AVAILABLE_STATES_PREDICTION, payload: predictionStates });
      }
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
 * @description action creator for fetching available sublocations in data
 * @param {Object} [overrideFilter={}] optional filter to override selection values in redux
 * @param {Object} [levels={}] optional ability to not query on historical or prediction levels
 */
export function getAvailableSublocations(state, overrideFilter = {}, { historical = true, prediction = true } = {}) {
  return async (dispatch, getState) => {
    const {
      dataMode,
      endYear,
      startYear,
      predictionYear,
    } = getState().selections;

    const filters = {
      startYear,
      endYear,
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
          startYear: predictionYear,
          endYear: predictionYear,
        });

        dispatch({ type: ActionTypes.SET_AVAILABLE_SUBLOCATIONS_PREDICTION, payload: predictionSublocations });
      }
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
 * @description action creator for setting prediction year
 * @param {Number} year year to set
 */
export const setPredictionYear = (year) => {
  return (dispatch, getState) => {
    const { state } = getState().selections;

    dispatch({ type: ActionTypes.SET_PREDICTION_YEAR, payload: { year } });

    // fetch new data
    dispatch(getPredictions(year));

    // fetch new drop down values
    dispatch(getAvailableStates({ startYear: year, endYear: year, predictionYear: year }, { historical: false }));
    if (state) { dispatch(getAvailableSublocations(state, { startYear: year, endYear: year, predictionYear: year }, { historical: false })); }
  };
};

/**
 * @description action creator for setting start year
 * @param {Number} startYear start year to set
 */
export const setStartYear = (startYear) => {
  return (dispatch, getState) => {
    const { state } = getState().selections;

    dispatch({ type: ActionTypes.SET_START_YEAR, payload: { startYear } });

    // clear out existing data
    dispatch(clearData());

    // fetch new data
    dispatch(getAggregateYearData({ startYear }));
    dispatch(getAggregateStateData({ startYear }));
    dispatch(getAggregateLocationData({ startYear }));

    // fetch new drop down values
    dispatch(getAvailableStates({ startYear }, { prediction: false }));
    if (state) { dispatch(getAvailableSublocations(state, { startYear }, { prediction: false })); }
  };
};

/**
 * @description action creator for setting end year
 * @param {Number} endYear end year to set
 */
export const setEndYear = (endYear) => {
  return (dispatch, getState) => {
    const { state } = getState().selections;

    dispatch({ type: ActionTypes.SET_END_YEAR, payload: { endYear } });

    // clear out existing data
    dispatch(clearData());

    // fetch new data
    dispatch(getAggregateYearData({ endYear }));
    dispatch(getAggregateStateData({ endYear }));
    dispatch(getAggregateLocationData({ endYear }));

    // fetch new drop down values
    dispatch(getAvailableStates({ endYear }, { prediction: false }));
    if (state) { dispatch(getAvailableSublocations(state, { endYear }, { prediction: false })); }
  };
};

/**
 * @description action creator for selecting from first year till onwards
 */
export const setAllYears = () => {
  return (dispatch, getState) => {
    const { availableYears, state } = getState().selections;

    const startYear = Math.min(...availableYears);
    const endYear = Math.max(...availableYears);

    dispatch({ type: ActionTypes.SET_START_YEAR, payload: { startYear } });
    dispatch({ type: ActionTypes.SET_END_YEAR, payload: { endYear } });
    dispatch({ type: ActionTypes.SET_PREDICTION_YEAR, payload: { year: endYear } });

    // clear out existing data
    dispatch(clearData());

    // fetch new data
    dispatch(getAggregateYearData({ startYear, endYear }));
    dispatch(getAggregateStateData({ startYear, endYear }));
    dispatch(getAggregateLocationData({ startYear, endYear }));
    dispatch(getPredictions(endYear));

    // fetch new drop down values
    dispatch(getAvailableStates({ startYear, endYear, predictionYear: endYear }));
    if (state) { dispatch(getAvailableSublocations(state, { startYear, endYear, predictionYear: endYear })); }
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
    dispatch(getAggregateYearData({ state }));
    dispatch(getAggregateStateData({ state }));
    dispatch(getAggregateLocationData({ state }));
    dispatch(getPredictions(getState().selections.predictionYear), { state });

    // fetch new drop down values
    dispatch(getAvailableYears({ state }));
    dispatch(getAvailableSublocations(state));
  };
};

/**
 * @description action creator for setting county
 * @param {String} county county name
 */
export const setCounty = (county) => {
  return (dispatch, getState) => {
    dispatch({ type: ActionTypes.SET_COUNTY, payload: { county } });

    // clear out existing data
    dispatch(clearData());

    // TODO: generate new array for multi-counties (when support multi-select) and pass to below function calls

    // fetch new data
    dispatch(getAggregateYearData({ county: [county] }));
    dispatch(getAggregateStateData({ county: [county] }));
    dispatch(getAggregateLocationData({ county: [county] }));
    dispatch(getPredictions(getState().selections.predictionYear), { county: [county] });

    // fetch new drop down values
    dispatch(getAvailableYears({ county }));
  };
};

/**
 * @description action creator for setting ranger district
 * @param {String} rangerDistrict ranger district name
 */
export const setRangerDistrict = (rangerDistrict) => {
  return (dispatch, getState) => {
    dispatch({ type: ActionTypes.SET_RANGER_DISTRICT, payload: { rangerDistrict } });

    // clear out existing data
    dispatch(clearData());

    // TODO: generate new array for multi-rangerdistricts (when support multi-select) and pass to below function calls

    // fetch new data
    dispatch(getAggregateYearData({ rangerDistrict: [rangerDistrict] }));
    dispatch(getAggregateStateData({ rangerDistrict: [rangerDistrict] }));
    dispatch(getAggregateLocationData({ rangerDistrict: [rangerDistrict] }));
    dispatch(getPredictions(getState().selections.predictionYear), { rangerDistrict: [rangerDistrict] });

    // fetch new drop down values
    dispatch(getAvailableYears({ rangerDistrict }));
  };
};

/**
 * @description action creator for clearing all selections
 */
export const clearSelections = () => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.CLEAR_SELECTIONS });

    // clear out existing data
    dispatch(clearData());

    // fetch new data
    dispatch(getAggregateYearData());
    dispatch(getAggregateStateData());
    dispatch(getAggregateLocationData());

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
    dispatch(getAggregateYearData());
    dispatch(getAggregateStateData());
    dispatch(getAggregateLocationData());
    dispatch(getPredictions(getState().selections.predictionYear));

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
    setChartModeInStorage(mode);
    dispatch({ type: ActionTypes.SET_CHART_MODE, payload: mode });
  };
};
