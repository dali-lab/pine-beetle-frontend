import { connect } from 'react-redux';

import PredictionMap from './component';

import {
  clearSelections,
  setCounty,
  setCountyFilter,
  setDataMode,
  setPredictionModal,
  setPredictionYear,
  setRangerDistrict,
  setRangerDistrictFilter,
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
      predictionModal,
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
    predictionModal,
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
  mapDispatchToProps
)(PredictionMap);
