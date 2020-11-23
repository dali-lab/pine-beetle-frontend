import axios from 'axios';
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_ID,
  DOWNLOAD_DATA_ROUTES,
  getAutomationServerUrl,
  stateAbbrevToStateName,
} from '../constants';

/**
 * @param {String} abbrev state abbreviation
 * @returns {String} state name
 */
export const getStateNameFromAbbreviation = (abbrev) => {
  if (!abbrev) return '';
  return Object.values(stateAbbrevToStateName)
    .find((stateName) => {
      return stateAbbrevToStateName[abbrev] === stateName;
    });
};

/**
 * @param {String} stateName state name
 * @returns {String} state abbreviation
 */
export const getStateAbbreviationFromStateName = (stateName) => {
  if (!stateName) return '';
  return Object.keys(stateAbbrevToStateName)
    .find((abbrev) => {
      return stateAbbrevToStateName[abbrev] === stateName;
    });
};

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

/**
 * @description downloads trapping data as csv
 * @param {String} dataType the type of data we want to download, i.e. UNSUMMARIZED, SUMMARIZED_COUNTY, etc.
 * @param {Object} [queryParams={}] object of query parameters
 */
export const downloadCsv = async (dataType, queryParams = {}) => {
  const query = toQueryParams(queryParams);
  const url = `${getAutomationServerUrl()}${DOWNLOAD_DATA_ROUTES[dataType]}${query.length > 0 ? '?' : ''}${query}`;

  const { data } = await axios.get(url, { responseType: 'blob' });
  const objectUrl = URL.createObjectURL(data);

  const link = document.createElement('a');
  link.href = objectUrl;
  link.setAttribute('download', dataType === 'HELPER' ? `${dataType}.zip` : `${dataType}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
