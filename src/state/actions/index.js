import {
  ActionTypes as userActionTypes,
  login,
  signUp,
} from './user';

import {
  ActionTypes as selectionActionTypes,
  clearSelections,
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
  getCountyPredictions,
  getRangerDistrictPredictions,
} from './predictions';

const ActionTypes = {
  ...predictionActionTypes,
  ...selectionActionTypes,
  ...trappingActionTypes,
  ...userActionTypes,
};

export {
  ActionTypes,
  clearSelections,
  getCountyPredictions,
  getCountyTrapping,
  getRangerDistrictPredictions,
  getRangerDistrictTrapping,
  login,
  setCounty,
  setDataMode,
  setRangerDistrict,
  setState,
  setYear,
  setYearRange,
  signUp,
};
