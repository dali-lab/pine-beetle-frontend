import { LOCAL_STORAGE_KEYS } from '../constants';

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

/**
 * @description retrieves state from local storage
 * @returns {String} state
 */
export const getStateFromStorage = getLocal(LOCAL_STORAGE_KEYS.STATE);

/**
 * @description sets state in local storage
 * @param {String} state state to set
 */
export const setStateInStorage = setLocal(LOCAL_STORAGE_KEYS.STATE);

/**
 * @description removes state from local storage
 * @returns {String} state
 */
export const removeStateFromStorage = removeLocal(LOCAL_STORAGE_KEYS.STATE);

/**
 * @description retrieves county from local storage
 * @returns {String} county
 */
export const getCountyFromStorage = getLocal(LOCAL_STORAGE_KEYS.COUNTY);

/**
 * @description sets county in local storage
 * @param {String} county county to set
 */
export const setCountyInStorage = setLocal(LOCAL_STORAGE_KEYS.COUNTY);

/**
 * @description removes county from local storage
 * @returns {String} county
 */
export const removeCountyFromStorage = removeLocal(LOCAL_STORAGE_KEYS.COUNTY);

/**
 * @description retrieves ranger districct from local storage
 * @returns {String} ranger district
 */
export const getRangerDistrictFromStorage = getLocal(LOCAL_STORAGE_KEYS.RANGER_DISTRICT);

/**
 * @description sets ranger district in local storage
 * @param {String} rangerDistrict ranger district to set
 */
export const setRangerDistrictInStorage = setLocal(LOCAL_STORAGE_KEYS.RANGER_DISTRICT);

/**
 * @description removes ranger district from local storage
 * @returns {String} ranger district
 */
export const removeRangerDistrictFromStorage = removeLocal(LOCAL_STORAGE_KEYS.RANGER_DISTRICT);

/**
 * @description retrieves year from local storage
 * @returns {String} year
 */
export const getYearFromStorage = getLocal(LOCAL_STORAGE_KEYS.YEAR);

/**
 * @description sets year in local storage
 * @param {String} year year to set
 */
export const setYearInStorage = setLocal(LOCAL_STORAGE_KEYS.YEAR);

/**
 * @description removes year from local storage
 * @returns {String} year
 */
export const removeYearFromStorage = removeLocal(LOCAL_STORAGE_KEYS.YEAR);

/**
 * @description retrieves start year from local storage
 * @returns {String} start year
 */
export const getStartYearFromStorage = getLocal(LOCAL_STORAGE_KEYS.START_YEAR);

/**
 * @description sets start year in local storage
 * @param {String} startYear start year to set
 */
export const setStartYearInStorage = setLocal(LOCAL_STORAGE_KEYS.START_YEAR);

/**
 * @description removes start year from local storage
 * @returns {String} start year
 */
export const removeStartYearFromStorage = removeLocal(LOCAL_STORAGE_KEYS.START_YEAR);

/**
 * @description retrieves end year from local storage
 * @returns {String} end year
 */
export const getEndYearFromStorage = getLocal(LOCAL_STORAGE_KEYS.END_YEAR);

/**
 * @description sets end year in local storage
 * @param {String} endYear end year to set
 */
export const setEndYearInStorage = setLocal(LOCAL_STORAGE_KEYS.END_YEAR);

/**
 * @description removes end year from local storage
 * @returns {String} end year
 */
export const removeEndYearFromStorage = removeLocal(LOCAL_STORAGE_KEYS.END_YEAR);
