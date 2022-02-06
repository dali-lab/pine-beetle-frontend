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
  setRangerDistrict,
  setState,
  setYear,
  setYearRange,
} from './selections';

import {
  ActionTypes as trappingActionTypes,
  getCountyTrapping,
  getRangerDistrictTrapping,
} from './trapping';

import {
  ActionTypes as predictionActionTypes,
  clearCustomPredictionError,
  getCountyPredictions,
  getRangerDistrictPredictions,
  runCustomPrediction,
} from './predictions';

const ActionTypes = {
  ...predictionActionTypes,
  ...selectionActionTypes,
  ...trappingActionTypes,
  ...userActionTypes,
};

export {
  ActionTypes,
  clearCustomPredictionError,
  clearSelections,
  getCountyPredictions,
  getCountyTrapping,
  getRangerDistrictPredictions,
  getRangerDistrictTrapping,
  getUserFromStorage,
  login,
  runCustomPrediction,
  setAllYears,
  setChartMode,
  setCounty,
  setDataMode,
  setRangerDistrict,
  setState,
  setYear,
  setYearRange,
  signOut,
};
