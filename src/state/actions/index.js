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
  setRangerDistrict,
  setStartYear,
  setState,
  setYear,
} from './selections';

import {
  ActionTypes as dataActionTypes,
  getAggregateYearData,
  getAggregateStateData,
  getAggregateLocationData,
  getPredictions,
  runCustomPrediction,
  clearCustomPredictionError,
} from './data';

const ActionTypes = {
  ...dataActionTypes,
  ...selectionActionTypes,
  ...userActionTypes,
};

export {
  ActionTypes,
  clearCustomPredictionError,
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
  setRangerDistrict,
  setStartYear,
  setState,
  setYear,
  signOut,
};
