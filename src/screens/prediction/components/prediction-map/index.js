import { connect } from 'react-redux';

import StateMap from './component';

import {
  clearSelections,
  setCounty,
  setPredictionModal,
  setPredictionYear,
  setRangerDistrict,
  setState,
} from '../../../../state/actions';

const mapStateToProps = (state) => {
  const {
    selections: {
      county,
      dataMode,
      rangerDistrict,
      state: selectedState,
      predictionYear: year,
      availablePredictionStates,
      availablePredictionSublocations,
      availablePredictionYears,
    },
    data: {
      predictions,
    },
  } = state;

  return {
    availableStates: availablePredictionStates,
    availableSublocations: availablePredictionSublocations,
    availableYears: availablePredictionYears,
    county,
    dataMode,
    data: predictions,
    rangerDistrict,
    selectedState,
    year,
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
    setPredictionModal: (show) => {
      dispatch(setPredictionModal(show));
    },
    setPredictionYear: (year) => {
      dispatch(setPredictionYear(year));
    },
    clearAllSelections: () => {
      dispatch(clearSelections());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateMap);
