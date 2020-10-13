/* eslint-disable import/prefer-default-export */

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
