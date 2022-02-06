import {
  ActionTypes as userActionTypes,
  getUserFromStorage,
  login,
  signOut,
} from './user';

import {
  ActionTypes as selectionActionTypes,
  clearSelections,
  setAllYears,
  setChartMode,
  setCounty,
  setDataMode,
  setEndYear,
  setPredictionYear,
  setRangerDistrict,
  setStartYear,
  setState,
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
  signOut,
};
