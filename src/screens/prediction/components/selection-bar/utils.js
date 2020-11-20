import {
  stateAbbrevToStateName,
} from '../../../../constants';

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
