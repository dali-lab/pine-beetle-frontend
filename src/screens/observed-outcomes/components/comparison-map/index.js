import { connect } from 'react-redux';
import {
  ActionTypes,
  getAvailableSublocations,
  setCounty,
  setCountyFilter,
  setDataMode,
  setRangerDistrict,
  setRangerDistrictFilter,
  setState,
} from '../../../../state/actions';
import ComparisonMap from './component';

const mapStateToProps = (state) => {
  const {
    selections: {
      county,
      rangerDistrict,
      dataMode,
      state: selectedState,
      predictionYear: year,
      availablePredictionYears,
      availablePredictionStates,
      availablePredictionSublocations,
    },
    data: {
      resultsComparison,
      fetchingResultsComparisonData,
    },
  } = state;

  return {
    availableStates: availablePredictionStates,
    availableSublocations: availablePredictionSublocations,
    data: resultsComparison,
    dataMode,
    county,
    rangerDistrict,
    selectedState,
    year,
    isLoading: fetchingResultsComparisonData,
    yearsLoaded: availablePredictionYears && availablePredictionYears.length > 0,

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCounty: (county) => {
      dispatch(setCounty(county));
    },
    setCountyFilter: (county) => {
      dispatch(setCountyFilter(county));
    },
    setDataMode: (mode) => {
      dispatch(setDataMode(mode));
    },
    setRangerDistrict: (rangerDistrict) => {
      dispatch(setRangerDistrict(rangerDistrict));
    },
    setRangerDistrictFilter: (rangerDistrict) => {
      dispatch(setRangerDistrictFilter(rangerDistrict));
    },
    setState: (state) => {
      dispatch(setState(state));
    },
    clearAllSelections: () => {
      dispatch({ type: ActionTypes.SET_STATE, payload: { state: '' } });
      dispatch({ type: ActionTypes.SET_COUNTY_FILTER, payload: { county: [] } });
      dispatch({ type: ActionTypes.SET_RANGER_DISTRICT_FILTER, payload: { rangerDistrict: [] } });
      dispatch(getAvailableSublocations('', {}, { historical: false, prediction: true }));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComparisonMap);
