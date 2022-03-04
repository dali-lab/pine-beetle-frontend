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
  runCustomPrediction,
} from './data';

const ActionTypes = {
  ...dataActionTypes,
  ...selectionActionTypes,
  ...userActionTypes,
};

export {
  ActionTypes,
  clearCustomPredictionError,
  clearData,
  clearSelections,
  getAggregateLocationData,
  getAggregateStateData,
  getAggregateYearData,
  getAvailableStates,
  getAvailableSublocations,
  getAvailableYears,
  getPredictions,
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
