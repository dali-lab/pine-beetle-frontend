import { getHistogram as getHistogramService } from '../../services';

export const ActionTypes = {
  GET_HISTOGRAM: 'GET_HISTOGRAM',
  HISTOGRAM_API_ERROR: 'HISTOGRAM_API_ERROR',
};

export const getHistogram = () => {
  return async (dispatch) => {
    try {
      const data = await getHistogramService();
      dispatch({ type: ActionTypes.GET_HISTOGRAM, payload: data });
    } catch (error) {
      console.log('error', error);
      dispatch({
        type: ActionTypes.HISTOGRAM_API_ERROR,
        payload: 'GET HISTOGRAM DATA',
        error,
      });
    }
  };
};
