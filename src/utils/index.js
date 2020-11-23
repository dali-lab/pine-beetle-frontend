import { AUTH_TOKEN_KEY, AUTH_USER_ID } from '../constants';

/**
 * @description casts object to url query params
 * @param {Object} obj generic object to cast
 * @returns {String} string of query params from object
 */
export const toQueryParams = obj => (
  Object.entries(obj).map(([key, value]) => {
    return `${key}=${value}`;
  }).join('&')
);

/**
 * @description splits string up by pascal case
 * adopted from: https://stackoverflow.com/questions/26188882/split-pascal-case-in-javascript-certain-case/26188910
 * @param {String} str string to separate
 */
export const separatePascalCase = (str) => {
  return str
    // Look for long acronyms and filter out the last letter
    .replace(/([A-Z]+)([A-Z][a-z])/g, ' $1 $2')
    // Look for lower-case letters followed by upper-case letters
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    // Look for lower-case letters followed by numbers
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/^./, s => s.toUpperCase())
    // Remove any white space left around the word
    .trim();
};

/**
 * @description maps ranger district name format in db to mapbox format
 * @param {String} rangerDistrict ranger district name
 */
export const getMapboxRDNameFormat = rangerDistrict => (
  rangerDistrict.match(/\((.*?)\)/)?.[1]
);

/**
 * @description retrieves user auth token from local storage
 * @returns {String} auth token
 */
export const getAuthTokenFromStorage = () => localStorage.getItem(AUTH_TOKEN_KEY);

/**
 * @description retrieves user id from local storage
 * @returns {String} user id
 */
export const getUserIdFromStorage = () => localStorage.getItem(AUTH_USER_ID);
