import { connect } from 'react-redux';

import SelectionBar from './component';

import {
  clearSelections,
  setCounty,
  setDataMode,
  setPredictionYear,
  setRangerDistrict,
  setState,
} from '../../../../state/actions';

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
    county: county[0],
    rangerDistrict: rangerDistrict[0],
    selectedState,
    dataMode,
    year,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearAllSelections: () => {
      dispatch(clearSelections());
    },
    setPredictionYear: (year) => {
      dispatch(setPredictionYear(year));
    },
    setCounty: (county) => {
      dispatch(setCounty(county));
    },
    setDataMode: (dataMode) => {
      dispatch(setDataMode(dataMode));
    },
    setRangerDistrict: (rangerDistrict) => {
      dispatch(setRangerDistrict(rangerDistrict));
    },
    setState: (state) => {
      dispatch(setState(state));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectionBar);
