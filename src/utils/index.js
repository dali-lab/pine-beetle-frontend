import {
  getMapboxRDNameFormat,
  getStateAbbreviationFromStateName,
  getStateNameFromAbbreviation,
} from './abbreviation-mappings';

import {
  getAuthTokenFromStorage,
  getChartModeFromStorage,
  getDataModeFromStorage,
  getUserIdFromStorage,
  removeAuthTokenFromStorage,
  removeUserIdFromStorage,
  setAuthTokenInStorage,
  setChartModeInStorage,
  setDataModeInStorage,
  setUserIdInStorage,
} from './local-storage';

import {
  downloadCsv,
  toQueryParams,
} from './network';

import {
  sortBlogPosts,
  getDateToDisplay,
  getLatestBlogPost,
  formatPostDates,
  truncateText,
} from './blog';

import getFillColor from './colors';

import {
  createMapClickCallback,
  createHoverCallback,
  downloadMap,
  generateMap,
  mapboxHoverStyle,
  zoomToSelectedState,
} from './map';

export * from './map-coloring';
export * from './map-mode-utils';

export {
  createHoverCallback,
  createMapClickCallback,
  downloadCsv,
  downloadMap,
  generateMap,
  getAuthTokenFromStorage,
  getChartModeFromStorage,
  getDataModeFromStorage,
  getDateToDisplay,
  getFillColor,
  getLatestBlogPost,
  getMapboxRDNameFormat,
  getStateAbbreviationFromStateName,
  getStateNameFromAbbreviation,
  getUserIdFromStorage,
  formatPostDates,
  mapboxHoverStyle,
  removeAuthTokenFromStorage,
  removeUserIdFromStorage,
  setAuthTokenInStorage,
  setChartModeInStorage,
  setDataModeInStorage,
  setUserIdInStorage,
  sortBlogPosts,
  toQueryParams,
  truncateText,
  zoomToSelectedState,
};
