import {
  getUserFromStorage,
  login,
  signOut,
  ActionTypes as userActionTypes,
} from './user';

import {
  clearSelections,
  getAvailableStates,
  getAvailableSublocations,
  getAvailableYears,
  ActionTypes as selectionActionTypes,
  setAllYears,
  setChartMode,
  setCounty,
  setCountyFilter,
  setDataMode,
  setEndYear,
  setPredictionModal, // eslint-disable-line no-unused-vars
  setPredictionYear,
  setRangerDistrict,
  setRangerDistrictFilter,
  setStartYear,
  setState,
} from './selections';

import {
  clearCustomPredictionError,
  clearData,
  ActionTypes as dataActionTypes,
  getAggregateLocationData,
  getAggregateStateData,
  getAggregateYearData,
  getPredictions,
  getResultsComparisonData,
  getScatterChartData,
  getSparseData,
  runCustomPrediction,
} from './data';

import {
  ActionTypes as blogActionTypes,
  createBlogPost,
  deleteBlogPost,
  editBlogPost,
  getAllBlogPosts,
  getAllBlogPostsByAuthor,
} from './blog';

import {
  getHistogram,
  ActionTypes as histogramActionTypes,
} from './histogram';

const ActionTypes = {
  ...dataActionTypes,
  ...selectionActionTypes,
  ...userActionTypes,
  ...blogActionTypes,
  ...histogramActionTypes,
};

export {
  ActionTypes,
  clearCustomPredictionError,
  clearData,
  clearSelections,
  createBlogPost,
  deleteBlogPost,
  editBlogPost,
  getAggregateLocationData,
  getAggregateStateData,
  getAggregateYearData,
  getAllBlogPosts,
  getAllBlogPostsByAuthor,
  getAvailableStates,
  getAvailableSublocations,
  getAvailableYears,
  getHistogram,
  getPredictions,
  getResultsComparisonData, getScatterChartData, getSparseData, getUserFromStorage,
  login,
  runCustomPrediction,
  setAllYears,
  setChartMode,
  setCounty,
  setCountyFilter,
  setDataMode,
  setEndYear, setPredictionModal, setPredictionYear,
  setRangerDistrict,
  setRangerDistrictFilter,
  setStartYear,
  setState, signOut,
};
