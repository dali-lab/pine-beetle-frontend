/* eslint-disable import/prefer-default-export */
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
