import { DATA_MODES } from '../../constants';

export const ActionTypes = {
  SET_YEAR: 'SET_SET_YEARSELECTED_YEAR',
  SET_YEAR_RANGE: 'SET_YEAR_RANGE',
  SET_STATE: 'SET_STATE',
  SET_COUNTY: 'SET_COUNTY',
  SET_RANGER_DISTRICT: 'SET_RANGER_DISTRICT',
  CLEAR_SELECTIONS: 'CLEAR_SELECTIONS',
  SET_ALL_STATES: 'SET_ALL_STATES',
  SET_ALL_COUNTIES: 'SET_ALL_COUNTIES',
  SET_ALL_RANGER_DISTRICTS: 'SET_ALL_RANGER_DISTRICTS',
  SET_DATA_MODE: 'SET_DATA_MODE',
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
    dispatch({
      type: ActionTypes.SET_YEAR_RANGE,
      payload: {
        ...getState().selections,
        yearRange: {
          startYear: startYear || getState().selections.yearRange.startYear,
          endYear: endYear || getState().selections.yearRange.endYear,
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
  return (dispatch) => {
    dispatch({ type: ActionTypes.CLEAR_SELECTIONS });
  };
};

/**
 * @description action creator for setting data mode
 */
export const setDataMode = (mode) => {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.SET_DATA_MODE,
      payload: {
        ...attachData(getState(), mode),
        mode,
      },
    });
  };
};
