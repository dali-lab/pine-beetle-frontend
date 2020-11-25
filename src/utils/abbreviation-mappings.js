import {
  stateAbbrevToStateName,
  stateNameToAbbrev,
} from '../constants';

/**
 * @param {String} abbrev state abbreviation
 * @returns {String} state name
 */
export const getStateNameFromAbbreviation = (abbrev) => {
  if (!abbrev) return '';
  return stateAbbrevToStateName[abbrev];
};

/**
   * @param {String} stateName state name
   * @returns {String} state abbreviation
   */
export const getStateAbbreviationFromStateName = (stateName) => {
  if (!stateName) return '';
  return stateNameToAbbrev[stateName];
};

/**
 * @description maps ranger district name format in db to mapbox format
 * @param {String} rangerDistrict ranger district name
 */
export const getMapboxRDNameFormat = rangerDistrict => rangerDistrict.match(/\((.*?)\)/)?.[1];


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
