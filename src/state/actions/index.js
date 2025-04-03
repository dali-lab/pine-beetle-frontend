import {
  ActionTypes as userActionTypes,
  getUserFromStorage,
  login,
  signOut,
} from './user';

import {
  ActionTypes as selectionActionTypes,
  clearSelections,
  getAvailableStates,
  getAvailableSublocations,
  getAvailableYears,
  setAllYears,
  setChartMode,
  setCounty,
  setDataMode,
  setEndYear,
  setPredictionYear,
  setRangerDistrict,
  setStartYear,
  setState,
  setPredictionModal,
} from './selections';

import {
  ActionTypes as dataActionTypes,
  clearCustomPredictionError,
  clearData,
  getAggregateLocationData,
  getAggregateStateData,
  getAggregateYearData,
  getPredictions,
  getSparseData,
  runCustomPrediction,
  getResultsComparisonData,
} from './data';

import {
  ActionTypes as blogActionTypes,
  createBlogPost,
  getAllBlogPosts,
  getAllBlogPostsByAuthor,
  editBlogPost,
  deleteBlogPost,
} from './blog';

import {
  ActionTypes as histogramActionTypes,
  getHistogram,
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
  getResultsComparisonData,
  getSparseData,
  getUserFromStorage,
  login,
  runCustomPrediction,
  setAllYears,
  setChartMode,
  setCounty,
  setDataMode,
  setEndYear,
  setPredictionYear,
  setRangerDistrict,
  setStartYear,
  setState,
  setPredictionModal,
  signOut,
};
