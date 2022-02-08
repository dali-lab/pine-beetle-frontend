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
  setCounties,
  setDataMode,
  setEndYear,
  setPredictionYear,
  setRangerDistrict,
<<<<<<< HEAD
  setFederalLands,
=======
  setStartYear,
>>>>>>> 3973b844c5f5c2dd23a8094585bfa1ac4d74cc8c
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
  setCounties,
  setDataMode,
  setEndYear,
  setPredictionYear,
  setRangerDistrict,
<<<<<<< HEAD
  setFederalLands,
=======
  setStartYear,
>>>>>>> 3973b844c5f5c2dd23a8094585bfa1ac4d74cc8c
  setState,
  signOut,
};
