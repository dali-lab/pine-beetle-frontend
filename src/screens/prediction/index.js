import { connect } from 'react-redux';

import Prediction from './component';

import {
  setChartMode,
  clearSelections,
  setDataMode,
  setPredictionModal,
  setCounty,
  setRangerDistrict,
} from '../../state/actions';

const mapStateToProps = (state) => {
  const {
    error: {
      fetchError: {
        text: fetchErrorText,
      },
    },
    data: {
      predictions,
      fetchingPredictions,
      yearData,
    },
    selections: {
      predictionModal,
      chartMode,
      dataMode,
      county,
      rangerDistrict,
    },
    histogram: {
      frequency,
    },
  } = state;

  const isLoading = fetchingPredictions;

  return {
    data: predictions,
    endYear: yearData[yearData.length - 1]?.year,
    fetchErrorText,
    isLoading,
    predictionModal,
    chartMode,
    dataMode,
    county,
    rangerDistrict,
    frequency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPredictionModal: (show) => {
      dispatch(setPredictionModal(show));
    },
    clearAllSelections: () => {
      dispatch(clearSelections());
    },
    setChartMode: (mode) => {
      dispatch(setChartMode(mode));
    },
    setDataMode: (mode) => {
      dispatch(setDataMode(mode));
    },
    setCounty: (county) => {
      dispatch(setCounty(county));
    },
    setRangerDistrict: (rangerDistrict) => {
      dispatch(setRangerDistrict(rangerDistrict));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Prediction);
