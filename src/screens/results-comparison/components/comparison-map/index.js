import { connect } from 'react-redux';
import {
  setCounty, setRangerDistrict, setState,
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

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCounty: (county) => {
      dispatch(setCounty(county));
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
