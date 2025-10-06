import { connect } from 'react-redux';

import FilterBar from './component';

import {
  clearSelections,
  setCounty,
  setPredictionYear,
  setRangerDistrict,
  setState,
  setDataMode,
} from '../../state/actions';

const mapStateToProps = (state) => {
  const {
    selections: {
      predictionYear: year,
      state: selectedState,
      county,
      rangerDistrict,
      dataMode,
      availablePredictionYears,
      availablePredictionStates,
      availablePredictionSublocations,
    },
  } = state;

  return {
    availableYears: availablePredictionYears,
    availableStates: availablePredictionStates,
    availableSublocations: availablePredictionSublocations,
    county,
    rangerDistrict,
    selectedState,
    dataMode,
    predictionYear: year,
  };
};

const mapDispatchToProps = (dispatch) => ({
  clearAllSelections: () => {
    dispatch(clearSelections());
  },
  setPredictionYear: (year) => {
    dispatch(setPredictionYear(year));
  },
  setCounty: (county) => {
    dispatch(setCounty(county));
  },
  setRangerDistrict: (rangerDistrict) => {
    dispatch(setRangerDistrict(rangerDistrict));
  },
  setState: (state) => {
    dispatch(setState(state));
  },
  setDataMode: (mode) => {
    dispatch(setDataMode(mode));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterBar);
