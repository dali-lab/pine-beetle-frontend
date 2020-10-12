import { ActionTypes } from '../actions';

const initialState = {
  county: [],
  rangerDistrict: [],

  fetchingCounty: false,
  fetchingRangerDistrict: false,
};

const PredictionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_COUNTY_PREDICTIONS:
      return { ...state, county: action.payload };

    case ActionTypes.SET_RANGER_DISTRICT_PREDICTIONS:
      return { ...state, rangerDistrict: action.payload };

    case ActionTypes.FETCHING_COUNTY_PREDICTIONS:
      return { ...state, fetchingCounty: action.payload };

    case ActionTypes.FETCHING_RANGER_DISTRICT_PREDICTIONS:
      return { ...state, fetchingRangerDistrict: action.payload };

    default:
      return state;
  }
};

export default PredictionsReducer;
