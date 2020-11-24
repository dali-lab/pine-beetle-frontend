/* eslint-disable no-case-declarations */
import { ActionTypes } from '../actions';
import { DATA_MODES, CHART_MODES } from '../../constants';

import {
  getCountyFromStorage,
  getEndYearFromStorage,
  getRangerDistrictFromStorage,
  getStartYearFromStorage,
  getStateFromStorage,
  getYearFromStorage,
  setYearInStorage,
} from '../../utils';

const initialState = {
  year: new Date().getFullYear(),
  yearRange: {
    startYear: 2011,
    endYear: new Date().getFullYear(),
  },
  state: '',
  county: '',
  rangerDistrict: '',
  dataMode: DATA_MODES.COUNTY,
  chartMode: CHART_MODES.GRAPH,
};

const SelectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_YEAR:
      return { ...state, year: action.payload.year };

    case ActionTypes.SET_YEAR_RANGE:
      const { startYear, endYear } = action.payload.yearRange;

      return {
        ...state,
        yearRange: {
          startYear: startYear === '' ? '' : (startYear || state.yearRange.startYear),
          endYear: endYear === '' ? '' : (endYear || state.yearRange.endYear),
        },
      };

    case ActionTypes.SET_STATE:
      return { ...state, state: action.payload.state };

    case ActionTypes.SET_COUNTY:
      return { ...state, county: action.payload.county };

    case ActionTypes.SET_RANGER_DISTRICT:
      return { ...state, rangerDistrict: action.payload.rangerDistrict };

    case ActionTypes.SET_DATA_MODE:
      const { trappingData, predictionData, mode } = action.payload;

      // determine year and year range to set
      const yearsInTrappingData = [...new Set(trappingData.map(d => d.year))];
      const yearsInPredictionsData = [...new Set(predictionData.map(d => d.year))];

      const startYearInStorage = parseInt(getStartYearFromStorage(), 10);
      const endYearInStorage = parseInt(getEndYearFromStorage(), 10);
      const yearInStorage = parseInt(getYearFromStorage(), 10);

      const startYearInData = trappingData.reduce((prev, curr) => (prev.year < curr.year ? prev : curr), {})?.year || state.yearRange.startYear;
      const endYearInData = trappingData.reduce((prev, curr) => (prev.year > curr.year ? prev : curr), {})?.year || state.yearRange.endYear;
      const endYearInPredictions = predictionData.reduce((prev, curr) => (prev.year > curr.year ? prev : curr), {})?.year || state.yearRange.endYear;

      const startYearToSet = yearsInTrappingData.includes(startYearInStorage) ? startYearInStorage : startYearInData;
      const endYearToSet = yearsInTrappingData.includes(endYearInStorage) ? endYearInStorage : endYearInData;
      const yearToSet = yearsInPredictionsData.includes(yearInStorage) ? yearInStorage : endYearInPredictions;

      // determine state, county, ranger district to set
      const states = [...new Set(trappingData.map(d => d.state))];
      const stateToSet = states.length === 1 ? states[0] : getStateFromStorage();

      const counties = [...new Set(trappingData.map(d => d.county))];
      const countyToSet = counties.length === 1 ? counties[0] : getCountyFromStorage();

      const rangerDistricts = [...new Set(trappingData.map(d => d.rangerDistrict))];
      const rangerDistrictToSet = rangerDistricts.length === 1 ? rangerDistricts[0] : getRangerDistrictFromStorage();

      return {
        ...state,
        year: yearToSet,
        yearRange: {
          startYear: startYearToSet,
          endYear: endYearToSet,
        },
        state: stateToSet || '',
        county: countyToSet && mode === DATA_MODES.COUNTY ? countyToSet : '',
        rangerDistrict: rangerDistrictToSet && mode === DATA_MODES.RANGER_DISTRICT ? rangerDistrictToSet : '',
        dataMode: mode,
      };

    case ActionTypes.CLEAR_SELECTIONS:
      const year = action.payload.trappingData.reduce((prev, curr) => (
        prev.year > curr.year ? prev : curr
      ), {})?.year || state.yearRange.endYear;

      setYearInStorage(year);

      return {
        ...initialState,
        year,
      };

    case ActionTypes.SET_CHART_MODE:
      return { ...state, chartMode: action.payload };

    default:
      return state;
  }
};

export default SelectionsReducer;
