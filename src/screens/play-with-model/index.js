import { connect } from 'react-redux';

import {
  clearCustomPredictionError,
  clearSelections,
  runCustomPrediction,
} from '../../state/actions';

import PlayWithModel from './component';

const mapStateToProps = (state) => {
  const {
    selections: {
      county,
      dataMode,
      rangerDistrict,
      state: selectedState,
      predictionYear: year,
    },
    data: {
      customPrediction,
      fetchingPredictions,
      predictions,
    },
    error: {
      customPredictionError,
      fetchError: {
        text: fetchErrorText,
      },
    },
  } = state;

  const isError = customPredictionError.error.length > 0;

  const isLoading = fetchingPredictions;

  return {
    county: county[0],
    customPrediction,
    dataMode,
    error: customPredictionError,
    fetchErrorText,
    isError,
    isLoading,
    predictions,
    rangerDistrict: rangerDistrict[0],
    selectedState,
    year,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearAllSelections: () => {
      dispatch(clearSelections());
    },
    clearError: () => {
      dispatch(clearCustomPredictionError());
    },
    runCustomPrediction: (cleridst1, spotst1, spotst2, SPB, endobrev) => {
      dispatch(runCustomPrediction(cleridst1, spotst1, spotst2, SPB, endobrev));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayWithModel);
