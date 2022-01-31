import { DATA_MODES } from '../../constants';

import {
  setChartModeInStorage,
  setDataModeInStorage,
} from '../../utils';

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
};

/**
 * @description returns object of data
 * @param {Object} store redux store
 * @param {String} [mode] data mode (optional)
 */
const attachData = (store, mode) => {
  const {
    data: {
      county,
      rangerDistrict,
    },
    selections: {
      dataMode,
    },
  } = store;

  const modeToCompare = mode || dataMode;

  return {
    data: modeToCompare === DATA_MODES.COUNTY ? county : rangerDistrict,
  };
};

/**
 * @description action creator for setting start year
 */
export const setYear = (year) => {
  return (dispatch, getState) => {
    // TODO: here should send a new request to the backend for data, filtering on the provided year and location information in redux

    dispatch({
      type: ActionTypes.SET_YEAR,
      payload: {
        ...getState().selections,
        year,
      },
    });
  };
};

/**
 * @description action creator for setting start year
 */
export const setStartYear = (startYear) => {
  return (dispatch, getState) => {
    // TODO: here should send a new request to the backend for data, filtering on the provided year and location information in redux

    dispatch({
      type: ActionTypes.SET_START_YEAR,
      payload: {
        ...getState().selections,
        startYear,
      },
    });
  };
};

/**
 * @description action creator for setting start year
 */
export const setEndYear = (endYear) => {
  return (dispatch, getState) => {
    // TODO: here should send a new request to the backend for data, filtering on the provided year and location information in redux

    dispatch({
      type: ActionTypes.SET_END_YEAR,
      payload: {
        ...getState().selections,
        endYear,
      },
    });
  };
};

/**
 * @description action creator for selecting from first year till onwards
 */
export const setAllYears = () => {
  return (dispatch, getState) => {
    const { data } = attachData(getState());
    const years = data.map(({ year }) => year);

    const startYear = Math.min(...years);
    const endYear = Math.max(...years);

    // TODO: here should send a new request to the backend for data, filtering on the provided year and location information in redux

    dispatch({
      type: ActionTypes.SET_START_YEAR,
      payload: { ...getState().selections, startYear },
    });

    dispatch({
      type: ActionTypes.SET_END_YEAR,
      payload: { ...getState().selections, endYear },
    });
  };
};

/**
 * @description action creator for setting state
 */
export const setState = (state) => {
  return (dispatch, getState) => {
    // TODO: here should send a new request to the backend for data, filtering on the provided state and year information in redux

    dispatch({
      type: ActionTypes.SET_STATE,
      payload: {
        ...getState().selections,
        ...attachData(getState()),
        state,
      },
    });
  };
};

/**
 * @description action creator for setting county
 */
export const setCounty = (county) => {
  return (dispatch, getState) => {
    // TODO: here should send a new request to the backend for data, filtering on the provided county and state/year information in redux

    dispatch({
      type: ActionTypes.SET_COUNTY,
      payload: {
        ...getState().selections,
        county,
      },
    });
  };
};

/**
 * @description action creator for setting ranger district
 */
export const setRangerDistrict = (rangerDistrict) => {
  return (dispatch, getState) => {
    // TODO: here should send a new request to the backend for data, filtering on the provided ranger district and state/year information in redux

    dispatch({
      type: ActionTypes.SET_RANGER_DISTRICT,
      payload: {
        ...getState().selections,
        rangerDistrict,
      },
    });
  };
};

/**
 * @description action creator for clearing all selections
 */
export const clearSelections = () => {
  return (dispatch, getState) => {
    // TODO: here should send a new request to the backend for all data

    dispatch({
      type: ActionTypes.CLEAR_SELECTIONS,
      payload: {
        ...attachData(getState()),
        ...getState().selections,
      },
    });
  };
};

/**
 * @description action creator for setting data mode
 */
export const setDataMode = (mode) => {
  return (dispatch, getState) => {
    // TODO: here should send a new request to the backend for all data of the new mode and should clear out other data

    setDataModeInStorage(mode);

    const { data } = attachData(getState(), mode);
    const { state, startYear, endYear } = getState().selections;

    // determine if selections are in the new data we are using
    const stateInData = [...new Set(data.map(d => d.state))].includes(state);
    const startYearInData = [...new Set(data.map(d => d.year))].includes(startYear);
    const endYearInData = [...new Set(data.map(d => d.year))].includes(endYear);

    // determine min and max year
    const minYear = data.reduce((prev, curr) => (prev.year < curr.year ? prev : curr), {})?.year || startYear;
    const maxYear = data.reduce((prev, curr) => (prev.year > curr.year ? prev : curr), {})?.year || endYear;

    dispatch({
      type: ActionTypes.SET_DATA_MODE,
      payload: {
        data,
        ...getState().selections,
        // update selections based on if we can keep or have to clear
        startYear: startYearInData ? startYear : minYear,
        endYear: endYearInData ? endYear : maxYear,
        state: stateInData ? state : '',
        mode,
        filtersToApply: {
          endYearInData,
          startYearInData,
          stateInData,
        },
      },
    });
  };
};

/**
 * @description action creator for setting chart mode
 */
export const setChartMode = (mode) => {
  return (dispatch) => {
    setChartModeInStorage(mode);

    dispatch({
      type: ActionTypes.SET_CHART_MODE,
      payload: mode,
    });
  };
};
