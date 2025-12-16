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
  formatPostDates,
  getDateToDisplay,
  getLatestBlogPost,
  sortBlogPosts,
  truncateText,
} from './blog';

import {
  extractWeekNumber,
  formatCollectionDate,
  getValue,
  normalizeWeeklyData,
  parseYearFromItem,
  transformAggregatedData,
  transformRawData,
} from './data-table';

import getFillColor from './colors';

import {
  createHoverCallback,
  createMapClickCallback,
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
  extractWeekNumber,
  formatCollectionDate,
  formatPostDates,
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
  getValue,
  mapboxHoverStyle,
  normalizeWeeklyData,
  parseYearFromItem,
  removeAuthTokenFromStorage,
  removeUserIdFromStorage,
  setAuthTokenInStorage,
  setChartModeInStorage,
  setDataModeInStorage,
  setUserIdInStorage,
  sortBlogPosts,
  toQueryParams,
  transformAggregatedData,
  transformRawData,
  truncateText,
  zoomToSelectedState
};
