import { ActionTypes } from '../actions';

const initialState = {
  year: new Date().getFullYear(),
  yearRange: {
    startYear: 1987,
    endYear: new Date().getFullYear(),
  },
  state: '',
  county: '',
  rangerDistrict: '',
  allStates: [],
  allCounties: [],
  allRangerDistricts: [],
};

const SelectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_YEAR:
      return { ...state, year: action.payload };

    case ActionTypes.SET_YEAR_RANGE:
      return {
        ...state,
        yearRange: {
          startYear: action.payload.startYear === '' ? '' : (action.payload.startYear || state.yearRange.startYear),
          endYear: action.payload.endYear === '' ? '' : (action.payload.endYear || state.yearRange.endYear),
        },
      };

    case ActionTypes.SET_STATE:
      return { ...state, state: action.payload };

    case ActionTypes.SET_COUNTY:
      return { ...state, county: action.payload };

    case ActionTypes.SET_RANGER_DISTRICT:
      return { ...state, rangerDistrict: action.payload };

    case ActionTypes.SET_ALL_STATES:
      return { ...state, allStates: action.payload };

    case ActionTypes.SET_ALL_COUNTIES:
      return { ...state, allCounties: action.payload };

    case ActionTypes.SET_ALL_RANGER_DISTRICTS:
      return { ...state, allRangerDistricts: action.payload };

    case ActionTypes.CLEAR_SELECTIONS:
      return initialState;

    default:
      return state;
  }
};

export default SelectionsReducer;
