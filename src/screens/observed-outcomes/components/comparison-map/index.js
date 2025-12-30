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
import { fetchAllObservedOutcomesData } from '../../../../state/actions/data';
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
      dispatch((thunkDispatch, getState) => {
        const stateBeforeClear = getState();
        const latestYear = stateBeforeClear.selections.availablePredictionYears?.length > 0
          ? Math.max(...stateBeforeClear.selections.availablePredictionYears)
          : stateBeforeClear.selections.predictionYear;

        thunkDispatch({ type: ActionTypes.CLEAR_SELECTIONS });
        thunkDispatch(getAvailableSublocations('', {}, { historical: false, prediction: true }));

        if (latestYear) {
          thunkDispatch(fetchAllObservedOutcomesData(latestYear));
        }
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComparisonMap);
