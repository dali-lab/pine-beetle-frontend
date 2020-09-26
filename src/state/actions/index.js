import {
  ActionTypes as userActionTypes,
  login,
  signUp,
} from './user';

import {
  ActionTypes as selectionActionTypes,
  setAllCounties,
  setAllRangerDistricts,
  setAllStates,
  setCounty,
  setRangerDistrict,
  setState,
  setYear,
  setYearRange,
  clearSelections,
} from './selections';

const ActionTypes = {
  ...userActionTypes,
  ...selectionActionTypes,
};

export {
  ActionTypes,
  login,
  signUp,
  setAllCounties,
  setAllRangerDistricts,
  setAllStates,
  setCounty,
  setRangerDistrict,
  setState,
  setYear,
  setYearRange,
  clearSelections,
};
