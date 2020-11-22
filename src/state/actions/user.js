import { user as userService } from '../../services';

export const ActionTypes = {
  SET_USER_DATA: 'SET_USER_DATA',
  API_ERROR: 'API_ERROR',
};

/**
 * @description action creator for logging user in
 * @param {String} email user email
 * @param {String} password user password (plain text)
 * @param {Function} [onSuccess = () => {}] callback for when request is successful
 * @param {Function} [onError = () => {}] callback for when request fails
 */
export const login = (email, password, onSuccess = () => {}, onError = () => {}) => {
  return async (dispatch) => {
    try {
      const { user } = await userService.login(email, password);
      dispatch({ type: ActionTypes.SET_USER_DATA, payload: user });
      onSuccess();
    } catch (error) {
      dispatch({
        type: ActionTypes.API_ERROR,
        payload: {
          action: 'LOGIN',
          error,
        },
      });
      onError(error);
    }
  };
};

/**
 * @description action creator for signing user up
 * @param {String} email user email
 * @param {String} password user password (plain text)
 * @param {String} firstName user first name
 * @param {String} lastName user last name
 * @param {Function} [onSuccess = () => {}] callback for when request is successful
 * @param {Function} [onError = () => {}] callback for when request fails
 */
export const signUp = (email, password, firstName, lastName, onSuccess = () => {}, onError = () => {}) => {
  return async (dispatch) => {
    try {
      const { user } = await userService.signUp(email, password, firstName, lastName);
      onSuccess(user);
      // note that we don't dispatch the result here because signing up is an admin action on behalf of others
    } catch (error) {
      dispatch({
        type: ActionTypes.API_ERROR,
        payload: {
          action: 'SIGN UP',
          error,
        },
      });
      onError(error);
    }
  };
};

/**
 * @description action creator for logging user in from local storage
 */
export const getUserFromStorage = () => {
  return async (dispatch) => {
    try {
      const response = await userService.getUserFromStorage();
      dispatch({ type: ActionTypes.SET_USER_DATA, payload: response });
    } catch (error) {
      dispatch({
        type: ActionTypes.API_ERROR,
        payload: {
          action: 'LOGIN FROM STORAGE',
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
