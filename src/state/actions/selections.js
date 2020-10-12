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
 * @description action creator for setting start year
 */
export const setYear = (year) => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.SET_YEAR, payload: year });
  };
};

/**
 * @description action creator for setting end year
 */
export const setYearRange = (startYear, endYear) => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.SET_YEAR_RANGE,
      payload: {
        startYear,
        endYear,
      },
    });
  };
};

/**
 * @description action creator for setting state
 */
export const setState = (state) => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.SET_STATE, payload: state });
  };
};

/**
 * @description action creator for setting county
 */
export const setCounty = (county) => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.SET_COUNTY, payload: county });
  };
};

/**
 * @description action creator for setting ranger district
 */
export const setRangerDistrict = (rangerDistrict) => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.SET_RANGER_DISTRICT, payload: rangerDistrict });
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
 * @description action creator for setting all states
 */
export const setAllStates = (states) => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.SET_ALL_STATES, payload: states });
  };
};

/**
 * @description action creator for setting all counties
 */
export const setAllCounties = (counties) => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.SET_ALL_COUNTIES, payload: counties });
  };
};

/**
 * @description action creator for setting all states
 */
export const setAllRangerDistricts = (rangerDistricts) => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.SET_ALL_RANGER_DISTRICTS, payload: rangerDistricts });
  };
};

/**
 * @description action creator for setting data mode
 */
export const setDataMode = (mode) => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.SET_DATA_MODE, payload: mode });
  };
};
