import {
  stateAbbrevToStateId,
} from '../../../../constants';

/**
 * @description maps a state abbreviation to its id number
 * @param {Number} stateId state identifiction number
 * @returns {String} state abbreviation
 */
export const getStateAbbrevFromStateId = (stateId) => {
  return Object.keys(stateAbbrevToStateId)
    .find((abbrev) => {
      return stateAbbrevToStateId[abbrev] === stateId;
    });
};

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
