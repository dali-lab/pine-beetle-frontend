import { user as userService } from '../../services';

export const ActionTypes = {
  SET_USER_DATA: 'SET_USER_DATA',
  API_ERROR: 'API_ERROR',
};

/**
 * @description action creator for logging user in
 * @param {String} email user email
 * @param {String} password user password (plain text)
 */
export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const { user } = await userService.login(email, password);
      dispatch({ type: ActionTypes.SET_USER_DATA, payload: user });
    } catch (error) {
      dispatch({
        type: ActionTypes.API_ERROR,
        payload: {
          action: 'LOGIN',
          error,
        },
      });
    }
  };
};

/**
 * @description action creator for signing user up
 * @param {String} email user email
 * @param {String} password user password (plain text)
 * @param {String} firstName user first name
 * @param {String} lastName user last name
 */
export const signUp = (email, password, firstName, lastName) => {
  return async (dispatch) => {
    try {
      const response = await userService.signUp(email, password, firstName, lastName);
      dispatch({ type: ActionTypes.SET_USER_DATA, payload: response });
    } catch (error) {
      dispatch({
        type: ActionTypes.API_ERROR,
        payload: {
          action: 'LOGIN',
          error,
        },
      });
    }
  };
};

/**
 * @description action creator for signing user out
 */
export const signOut = () => {
  return (dispatch) => {
    userService.signOut();
    dispatch({ type: ActionTypes.SET_USER_DATA, payload: {} });
  };
};
