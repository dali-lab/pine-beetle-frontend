import { trapping } from '../../services';

export const ActionTypes = {
  SET_COUNTY_TRAPPING: 'SET_COUNTY_TRAPPING',
  SET_RANGER_DISTRICT_TRAPPING: 'SET_RANGER_DISTRICT_TRAPPING',

  FETCHING_COUNTY_TRAPPING: 'FETCHING_COUNTY_TRAPPING',
  FETCHING_RANGER_DISTRICT_TRAPPING: 'FETCHING_RANGER_DISTRICT_TRAPPING',
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
      console.log(error);
      // TODO: dispatch to generic error reducer
    } finally {
      dispatch({ type: ActionTypes.FETCHING_COUNTY_TRAPPING, payload: false });
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
      console.log(error);
      // TODO: dispatch to generic error reducer
    } finally {
      dispatch({ type: ActionTypes.FETCHING_RANGER_DISTRICT_TRAPPING, payload: false });
    }
  };
};
