import { connect } from 'react-redux';
import {
  setCounty, setDataMode, setRangerDistrict, setState,
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
    setDataMode: (mode) => {
      dispatch(setDataMode(mode));
    },
    setRangerDistrict: (rangerDistrict) => {
      dispatch(setRangerDistrict(rangerDistrict));
    },
    setState: (state) => {
      dispatch(setState(state));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComparisonMap);
