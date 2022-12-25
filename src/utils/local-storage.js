import { LOCAL_STORAGE_KEYS } from '../constants';

/**
 * @description retrieves key from local storage
 * @returns {String} value in local storage
 */
const getLocal = (key) => () => localStorage.getItem(key);

/**
 * @description sets key in local storage
 */
const setLocal = (key) => (value) => localStorage.setItem(key, value);

/**
 * @description removes key from local storage
 * @returns {String} value in local storage
 */
const removeLocal = (key) => () => localStorage.removeItem(key);

/**
 * @description retrieves user auth token from local storage
 * @returns {String} auth token
 */
export const getAuthTokenFromStorage = getLocal(LOCAL_STORAGE_KEYS.AUTH_TOKEN);

/**
 * @description sets auth token in local storage
 * @param {String} authToken auth token to set
 */
export const setAuthTokenInStorage = setLocal(LOCAL_STORAGE_KEYS.AUTH_TOKEN);

/**
 * @description removes user auth token from local storage
 * @returns {String} auth token
 */
export const removeAuthTokenFromStorage = removeLocal(LOCAL_STORAGE_KEYS.AUTH_TOKEN);

/**
 * @description retrieves user id from local storage
 * @returns {String} user id
 */
export const getUserIdFromStorage = getLocal(LOCAL_STORAGE_KEYS.USER_ID);

/**
 * @description sets user id in local storage
 * @param {String} userId user id to set
 */
export const setUserIdInStorage = setLocal(LOCAL_STORAGE_KEYS.USER_ID);

/**
 * @description removes user id from local storage
 * @returns {String} user id
 */
export const removeUserIdFromStorage = removeLocal(LOCAL_STORAGE_KEYS.USER_ID);

/**
 * @description retrieves data mode from local storage
 * @returns {String} data mode
 */
export const getDataModeFromStorage = getLocal(LOCAL_STORAGE_KEYS.DATA_MODE);

/**
 * @description sets data mode in local storage
 * @param {String} dataMode data mode to set
 */
export const setDataModeInStorage = setLocal(LOCAL_STORAGE_KEYS.DATA_MODE);

/**
 * @description retrieves chart mode from local storage
 * @returns {String} chart mode
 */
export const getChartModeFromStorage = getLocal(LOCAL_STORAGE_KEYS.CHART_MODE);

/**
 * @description sets chart mode in local storage
 * @param {String} chartMode chart mode to set
 */
export const setChartModeInStorage = setLocal(LOCAL_STORAGE_KEYS.CHART_MODE);
