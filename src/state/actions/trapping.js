import { trapping } from '../../services';

export const ActionTypes = {
  SET_COUNTY_TRAPPING: 'SET_COUNTY_TRAPPING',
  SET_RANGER_DISTRICT_TRAPPING: 'SET_RANGER_DISTRICT_TRAPPING',

  FETCHING_COUNTY_TRAPPING: 'FETCHING_COUNTY_TRAPPING',
  FETCHING_RANGER_DISTRICT_TRAPPING: 'FETCHING_RANGER_DISTRICT_TRAPPING',

  SET_TRAPPING_ERROR: 'SET_TRAPPING_ERROR',
  CLEAR_TRAPPING_ERROR: 'CLEAR_TRAPPING_ERROR',
};

/**
 * @description action creator for setting county trapping data
 */
export const getCountyTrapping = (filters = {}) => {
  return async (dispatch) => {
    dispatch({ type: ActionTypes.FETCHING_COUNTY_TRAPPING, payload: true });

    try {
      const response = await trapping.getAllCountyData(filters);
      dispatch({ type: ActionTypes.SET_COUNTY_TRAPPING, payload: response });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_TRAPPING_ERROR,
        payload: {
          error,
          text: 'Failed to fetch county trapping data',
        },
      });
    } finally {
      setTimeout(() => {
        dispatch({ type: ActionTypes.FETCHING_COUNTY_TRAPPING, payload: false });
      }, 1000);
    }
  };
};

/**
 * @description action creator for setting ranger district trapping data
 */
export const getRangerDistrictTrapping = (filters = {}) => {
  return async (dispatch) => {
    dispatch({ type: ActionTypes.FETCHING_RANGER_DISTRICT_TRAPPING, payload: true });

    try {
      const response = await trapping.getAllRDData(filters);
      dispatch({ type: ActionTypes.SET_RANGER_DISTRICT_TRAPPING, payload: response });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_TRAPPING_ERROR,
        payload: {
          error,
          text: 'Failed to fetch ranger district trapping data',
        },
      });
    } finally {
      setTimeout(() => {
        dispatch({ type: ActionTypes.FETCHING_RANGER_DISTRICT_TRAPPING, payload: false });
      }, 1000);
    }
  };
};
