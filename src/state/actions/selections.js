import {
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
  SET_YEAR: 'SET_YEAR',
  SET_START_YEAR: 'SET_START_YEAR',
  SET_END_YEAR: 'SET_END_YEAR',
  SET_STATE: 'SET_STATE',
  SET_COUNTY: 'SET_COUNTY',
  SET_RANGER_DISTRICT: 'SET_RANGER_DISTRICT',
  CLEAR_SELECTIONS: 'CLEAR_SELECTIONS',
  SET_ALL_STATES: 'SET_ALL_STATES',
  SET_ALL_COUNTIES: 'SET_ALL_COUNTIES',
  SET_ALL_RANGER_DISTRICTS: 'SET_ALL_RANGER_DISTRICTS',
  SET_DATA_MODE: 'SET_DATA_MODE',
  SET_CHART_MODE: 'SET_CHART_MODE',
  SET_AVAILABLE_YEARS: 'SET_AVAILABLE_YEARS',
  SET_AVAILABLE_STATES: 'SET_AVAILABLE_STATES',
  SET_AVAILABLE_SUBLOCATIONS: 'SET_AVAILABLE_SUBLOCATIONS',
};

/**
 * @description action creator for fetching available years in data
 */
export function getAvailableYears() {
  return async (dispatch, getState) => {
    const { dataMode } = getState().selections;

    try {
      const response = await api.getAvailableYears(dataMode);
      dispatch({ type: ActionTypes.SET_AVAILABLE_YEARS, payload: response });
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
 */
export function getAvailableStates() {
  return async (dispatch, getState) => {
    const { dataMode } = getState().selections;

    try {
      const response = await api.getAvailableStates(dataMode);
      dispatch({ type: ActionTypes.SET_AVAILABLE_STATES, payload: response });
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
 */
export function getAvailableSublocations(state) {
  return async (dispatch, getState) => {
    const { dataMode } = getState().selections;

    try {
      const response = await api.getAvailableSublocations(dataMode, state);
      dispatch({ type: ActionTypes.SET_AVAILABLE_SUBLOCATIONS, payload: response });
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
 * @description action creator for setting start and end year
 * @param {Number} year year to set
 */
export const setYear = (year) => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.SET_YEAR, payload: { year } });

    // fetch new data
    dispatch(getAggregateYearData({ startYear: year, endYear: year }));
    dispatch(getAggregateStateData({ startYear: year, endYear: year }));
    dispatch(getAggregateLocationData({ startYear: year, endYear: year }));
    dispatch(getPredictions(year));
  };
};

/**
 * @description action creator for setting start year
 * @param {Number} startYear start year to set
 */
export const setStartYear = (startYear) => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.SET_START_YEAR, payload: { startYear } });

    // fetch new data
    dispatch(getAggregateYearData({ startYear }));
    dispatch(getAggregateStateData({ startYear }));
    dispatch(getAggregateLocationData({ startYear }));
  };
};

/**
 * @description action creator for setting end year
 * @param {Number} endYear end year to set
 */
export const setEndYear = (endYear) => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.SET_END_YEAR, payload: { endYear } });

    // fetch new data
    dispatch(getAggregateYearData({ endYear }));
    dispatch(getAggregateStateData({ endYear }));
    dispatch(getAggregateLocationData({ endYear }));
    dispatch(getPredictions(endYear));
  };
};

/**
 * @description action creator for selecting from first year till onwards
 */
export const setAllYears = () => {
  return (dispatch, getState) => {
    const { availableYears } = getState().selections;

    const startYear = Math.min(...availableYears);
    const endYear = Math.max(...availableYears);

    dispatch({ type: ActionTypes.SET_START_YEAR, payload: { startYear } });
    dispatch({ type: ActionTypes.SET_END_YEAR, payload: { endYear } });

    // fetch new data
    dispatch(getAggregateYearData({ startYear, endYear }));
    dispatch(getAggregateStateData({ startYear, endYear }));
    dispatch(getAggregateLocationData({ startYear, endYear }));
    dispatch(getPredictions(getState().selections.endYear));
  };
};

/**
 * @description action creator for setting state
 * @param {String} state state abbreviation
 */
export const setState = (state) => {
  return (dispatch, getState) => {
    dispatch({ type: ActionTypes.SET_STATE, payload: { state } });

    // fetch new data
    dispatch(getAggregateYearData({ state }));
    dispatch(getAggregateStateData({ state }));
    dispatch(getAggregateLocationData({ state }));
    dispatch(getPredictions(getState().selections.endYear), { state });
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

    // TODO: generate new array for multi-counties (when support multi-select) and pass to below function calls

    // fetch new data
    dispatch(getAggregateYearData({ county }));
    dispatch(getAggregateStateData({ county }));
    dispatch(getAggregateLocationData({ county }));
    dispatch(getPredictions(getState().selections.endYear), { county });
  };
};

/**
 * @description action creator for setting ranger district
 * @param {String} rangerDistrict ranger district name
 */
export const setRangerDistrict = (rangerDistrict) => {
  return (dispatch, getState) => {
    dispatch({ type: ActionTypes.SET_RANGER_DISTRICT, payload: { rangerDistrict } });

    // TODO: generate new array for multi-rangerdistricts (when support multi-select) and pass to below function calls

    // fetch new data
    dispatch(getAggregateYearData({ rangerDistrict }));
    dispatch(getAggregateStateData({ rangerDistrict }));
    dispatch(getAggregateLocationData({ rangerDistrict }));
    dispatch(getPredictions(getState().selections.endYear), { rangerDistrict });
  };
};

/**
 * @description action creator for clearing all selections
 */
export const clearSelections = () => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.CLEAR_SELECTIONS });

    // fetch new data
    dispatch(getAggregateYearData());
    dispatch(getAggregateStateData());
    dispatch(getAggregateLocationData());

    dispatch({ type: ActionTypes.SET_AVAILABLE_SUBLOCATIONS, payload: [] });
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

    // fetch new data
    dispatch(getAggregateYearData());
    dispatch(getAggregateStateData());
    dispatch(getAggregateLocationData());
    dispatch(getPredictions(getState().selections.endYear));

    // fetch new selection criteria
    dispatch(getAvailableYears());
    dispatch(getAvailableStates());
    dispatch({ type: ActionTypes.SET_AVAILABLE_SUBLOCATIONS, payload: [] });
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
