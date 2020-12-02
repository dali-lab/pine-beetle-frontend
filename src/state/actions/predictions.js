import { predictions } from '../../services';

export const ActionTypes = {
  SET_COUNTY_PREDICTIONS: 'SET_COUNTY_PREDICTIONS',
  SET_RANGER_DISTRICT_PREDICTIONS: 'SET_RANGER_DISTRICT_PREDICTIONS',
  SET_CUSTOM_PREDICTION: 'SET_CUSTOM_PREDICTION',

  FETCHING_COUNTY_PREDICTIONS: 'FETCHING_COUNTY_PREDICTIONS',
  FETCHING_RANGER_DISTRICT_PREDICTIONS: 'FETCHING_RANGER_DISTRICT_PREDICTIONS',
  FETCHING_CUSTOM_PREDICTION: 'FETCHING_CUSTOM_PREDICTION',

  SET_PREDICTIONS_ERROR: 'SET_PREDICTIONS_ERROR',
  CLEAR_PREDICTIONS_ERROR: 'CLEAR_PREDICTIONS_ERROR',

  SET_CUSTOM_PREDICTION_ERROR: 'SET_CUSTOM_PREDICTION_ERROR',
  CLEAR_CUSTOM_PREDICTION_ERROR: 'CLEAR_CUSTOM_PREDICTION_ERROR',
};

/**
 * @description action creator for setting county prediction data
 */
export const getCountyPredictions = (filters = {}) => {
  return async (dispatch) => {
    dispatch({ type: ActionTypes.FETCHING_COUNTY_PREDICTIONS, payload: true });

    try {
      const response = await predictions.getAllCountyData(filters);
      dispatch({ type: ActionTypes.SET_COUNTY_PREDICTIONS, payload: response });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_PREDICTIONS_ERROR,
        payload: {
          error,
          text: 'Failed to fetch county predictions',
        },
      });
    } finally {
      setTimeout(() => {
        dispatch({ type: ActionTypes.FETCHING_COUNTY_PREDICTIONS, payload: false });
      }, 1000);
    }
  };
};

/**
 * @description action creator for setting ranger district prediction data
 */
export const getRangerDistrictPredictions = (filters = {}) => {
  return async (dispatch) => {
    dispatch({ type: ActionTypes.FETCHING_RANGER_DISTRICT_PREDICTIONS, payload: true });

    try {
      const response = await predictions.getAllRDData(filters);
      dispatch({ type: ActionTypes.SET_RANGER_DISTRICT_PREDICTIONS, payload: response });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_PREDICTIONS_ERROR,
        payload: {
          error,
          text: 'Failed to fetch ranger district predictions',
        },
      });
    } finally {
      setTimeout(() => {
        dispatch({ type: ActionTypes.FETCHING_RANGER_DISTRICT_PREDICTIONS, payload: false });
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
export const runCustomPrediction = (cleridst1, spotst1, spotst2, SPB, endobrev) => {
  return async (dispatch) => {
    dispatch({ type: ActionTypes.FETCHING_CUSTOM_PREDICTION, payload: true });

    try {
      const response = await predictions.runCustomPrediction(cleridst1, spotst1, spotst2, SPB, endobrev);
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
};

/**
 * @description action creator for clearing all selections
 */
export const clearCustomPredictionError = () => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.CLEAR_CUSTOM_PREDICTION_ERROR });
  };
};
