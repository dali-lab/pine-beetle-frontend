import { api } from '../../services';

export const ActionTypes = {
  SET_COUNTY_DATA: 'SET_COUNTY_DATA',
  SET_RANGERDISTRICT_DATA: 'SET_RANGERDISTRICT_DATA',
  SET_CUSTOM_PREDICTION: 'SET_CUSTOM_PREDICTION',

  FETCHING_COUNTY_DATA: 'FETCHING_COUNTY_DATA',
  FETCHING_RANGERDISTRICT_DATA: 'FETCHING_RANGERDISTRICT_DATA',
  FETCHING_CUSTOM_PREDICTION: 'FETCHING_CUSTOM_PREDICTION',

  SET_DATA_FETCH_ERROR: 'SET_DATA_FETCH_ERROR',
  SET_CUSTOM_PREDICTION_ERROR: 'SET_CUSTOM_PREDICTION_ERROR',

  CLEAR_DATA_FETCH_ERROR: 'CLEAR_DATA_FETCH_ERROR',
  CLEAR_CUSTOM_PREDICTION_ERROR: 'CLEAR_CUSTOM_PREDICTION_ERROR',
};

/**
 * @description action creator for setting county trapping data
 */
export function getCountyData(filters = {}) {
  return async (dispatch) => {
    dispatch({ type: ActionTypes.FETCHING_COUNTY_DATA, payload: true });

    try {
      const response = await api.getAllCountyData(filters);
      dispatch({ type: ActionTypes.SET_COUNTY_DATA, payload: response });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_DATA_FETCH_ERROR,
        payload: {
          error,
          text: 'Failed to fetch county data',
        },
      });
    } finally {
      setTimeout(() => {
        dispatch({ type: ActionTypes.FETCHING_COUNTY_DATA, payload: false });
      }, 1000);
    }
  };
}

/**
   * @description action creator for setting ranger district trapping data
   */
export const getRangerDistrictData = (filters = {}) => {
  return async (dispatch) => {
    dispatch({ type: ActionTypes.FETCHING_RANGERDISTRICT_DATA, payload: true });

    try {
      const response = await api.getAllRangerDistrictData(filters);
      dispatch({ type: ActionTypes.SET_RANGERDISTRICT_DATA, payload: response });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_DATA_FETCH_ERROR,
        payload: {
          error,
          text: 'Failed to fetch ranger district data',
        },
      });
    } finally {
      setTimeout(() => {
        dispatch({ type: ActionTypes.FETCHING_RANGERDISTRICT_DATA, payload: false });
      }, 1000);
    }
  };
};


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
