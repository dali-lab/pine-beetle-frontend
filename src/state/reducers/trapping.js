import { ActionTypes } from '../actions';

const initialState = {
  county: [],
  rangerDistrict: [],

  fetchingCounty: false,
  fetchingRangerDistrict: false,
};

const TrappingReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_COUNTY_TRAPPING:
      return { ...state, county: action.payload };

    case ActionTypes.SET_RANGER_DISTRICT_TRAPPING:
      return { ...state, rangerDistrict: action.payload };

    case ActionTypes.FETCHING_COUNTY_TRAPPING:
      return { ...state, fetchingCounty: action.payload };

    case ActionTypes.FETCHING_RANGER_DISTRICT_TRAPPING:
      return { ...state, fetchingRangerDistrict: action.payload };

    default:
      return state;
  }
};

export default TrappingReducer;
