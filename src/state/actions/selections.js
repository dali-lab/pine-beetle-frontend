import { DATA_MODES } from '../../constants';

import {
  removeCountyFromStorage,
  removeEndYearFromStorage,
  removeRangerDistrictFromStorage,
  removeStartYearFromStorage,
  removeStateFromStorage,
  setChartModeInStorage,
  setCountyInStorage,
  setDataModeInStorage,
  setEndYearInStorage,
  setRangerDistrictInStorage,
  setStartYearInStorage,
  setStateInStorage,
  setYearInStorage,
} from '../../utils';

export const ActionTypes = {
  SET_YEAR: 'SET_YEAR',
  SET_YEAR_RANGE: 'SET_YEAR_RANGE',
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
 * @description returns object of trapping and prediction data
 * @param {Object} store redux store
 * @param {String} [mode] data mode (optional)
 */
const attachData = (store, mode) => {
  const {
    trappings: {
      county: countyTrappings,
      rangerDistrict: rdTrappings,
    },
    predictions: {
      county: countyPredictions,
      rangerDistrict: rdPredictions,
    },
    selections: {
      dataMode,
    },
  } = store;

  const modeToCompare = mode || dataMode;

  return {
    trappingData: modeToCompare === DATA_MODES.COUNTY ? countyTrappings : rdTrappings,
    predictionData: modeToCompare === DATA_MODES.COUNTY ? countyPredictions : rdPredictions,
  };
};

/**
 * @description action creator for setting start year
 */
export const setYear = (year) => {
  return (dispatch, getState) => {
    setYearInStorage(year);

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
 * @description action creator for setting end year
 */
export const setYearRange = (startYear, endYear) => {
  return (dispatch, getState) => {
    if (startYear) setStartYearInStorage(startYear);
    if (endYear) setEndYearInStorage(endYear);

    dispatch({
      type: ActionTypes.SET_YEAR_RANGE,
      payload: {
        ...getState().selections,
        yearRange: {
          // explicit check against undefined instead of falsey value because empty string is valid input for nothing,
          // whereas undefined is strictly when not provided (so we default to previous value in this case)
          startYear: startYear !== undefined ? startYear : getState().selections.yearRange.startYear,
          endYear: endYear !== undefined ? endYear : getState().selections.yearRange.endYear,
        },
      },
    });
  };
};

/**
 * @description action creator for selecting from first year till onwards
 */
export const setAllYears = () => {
  return (dispatch, getState) => {
    const { trappingData } = attachData(getState());
    const years = trappingData.map(({ year }) => year);

    const startYear = Math.min(...years);
    const endYear = Math.max(...years);

    setStartYearInStorage(startYear);
    setEndYearInStorage(endYear);

    dispatch({
      type: ActionTypes.SET_YEAR_RANGE,
      payload: {
        ...getState().selections,
        yearRange: {
          startYear,
          endYear,
        },
      },
    });
  };
};

/**
 * @description action creator for setting state
 */
export const setState = (state) => {
  return (dispatch, getState) => {
    setStateInStorage(state);

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
    setCountyInStorage(county);

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
    setRangerDistrictInStorage(rangerDistrict);

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
    removeCountyFromStorage();
    removeRangerDistrictFromStorage();
    removeStateFromStorage();
    removeStartYearFromStorage();
    removeEndYearFromStorage();

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
    setDataModeInStorage(mode);

    const data = attachData(getState(), mode);

    dispatch({
      type: ActionTypes.SET_DATA_MODE,
      payload: {
        ...data,
        ...getState().selections,
        mode,
      },
    });

    // // find last year in dataset
    // const endYear = data.trappingData.reduce((prev, curr) => (
    //   prev.year > curr.year ? prev : curr
    // ), {})?.year || getState().selections.yearRange.endYear;

    // // explicitly set the year (to trigger filtering)
    // dispatch({
    //   type: ActionTypes.SET_YEAR,
    //   payload: {
    //     ...getState().selections,
    //     year: endYear,
    //   },
    // });
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
