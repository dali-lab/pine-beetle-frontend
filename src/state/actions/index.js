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
  getCountyData,
  getRangerDistrictData,
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
  getCountyData,
  getRangerDistrictData,
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
