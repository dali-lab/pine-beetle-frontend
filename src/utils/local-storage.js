import {
  AUTH_TOKEN_KEY,
  AUTH_USER_ID,
  DATA_MODE_KEY,
  CHART_MODE_KEY,
} from '../constants';

/**
 * @description retrieves key from local storage
 * @returns {String} value in local storage
 */
const getLocal = key => () => localStorage.getItem(key);

/**
 * @description sets key in local storage
 */
const setLocal = key => value => localStorage.setItem(key, value);

/**
 * @description removes key from local storage
 * @returns {String} value in local storage
 */
const removeLocal = key => () => localStorage.removeItem(key);

/**
 * @description retrieves user auth token from local storage
 * @returns {String} auth token
 */
export const getAuthTokenFromStorage = getLocal(AUTH_TOKEN_KEY);

/**
 * @description sets auth token in local storage
 * @param {String} authToken auth token to set
 */
export const setAuthTokenInStorage = setLocal(AUTH_TOKEN_KEY);

/**
 * @description removes user auth token from local storage
 * @returns {String} auth token
 */
export const removeAuthTokenFromStorage = removeLocal(AUTH_TOKEN_KEY);

/**
 * @description retrieves user id from local storage
 * @returns {String} user id
 */
export const getUserIdFromStorage = getLocal(AUTH_USER_ID);

/**
 * @description sets user id in local storage
 * @param {String} userId user id to set
 */
export const setUserIdInStorage = setLocal(AUTH_USER_ID);

/**
 * @description removes user id from local storage
 * @returns {String} user id
 */
export const removeUserIdFromStorage = removeLocal(AUTH_USER_ID);

/**
 * @description retrieves data mode from local storage
 * @returns {String} data mode
 */
export const getDataModeFromStorage = getLocal(DATA_MODE_KEY);

/**
 * @description sets data mode in local storage
 * @param {String} dataMode data mode to set
 */
export const setDataModeInStorage = setLocal(DATA_MODE_KEY);

/**
 * @description retrieves chart mode from local storage
 * @returns {String} chart mode
 */
export const getChartModeFromStorage = getLocal(CHART_MODE_KEY);

/**
 * @description sets chart mode in local storage
 * @param {String} chartMode chart mode to set
 */
export const setChartModeInStorage = setLocal(CHART_MODE_KEY);
