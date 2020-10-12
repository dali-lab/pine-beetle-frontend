import { ActionTypes } from '../actions';
import { DATA_MODES } from '../../constants';

const initialState = {
  data: [], // current data (changes when user updates data mode, components should import this)
  county: [], // the county data
  rangerDistrict: [], // the ranger district data

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

    case ActionTypes.SET_DATA_MODE:
      return { ...state, data: action.payload === DATA_MODES.COUNTY ? state.county : state.rangerDistrict };

    default:
      return state;
  }
};

export default TrappingReducer;
