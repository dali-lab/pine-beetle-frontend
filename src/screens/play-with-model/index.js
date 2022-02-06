import { connect } from 'react-redux';

import { clearCustomPredictionError, runCustomPrediction } from '../../state/actions';

import PlayWithModel from './component';

const mapStateToProps = (state) => {
  const {
    selections: {
      county,
      dataMode,
      rangerDistrict,
      state: selectedState,
      year,
    },
    trappings: {
      county: countyTrappingsData,
      rangerDistrict: rangerDistrictTrappingsData,
    },
    error: {
      customPredictionError,
    },
    predictions: {
      customPrediction,
      fetchingCustomPrediction,
    },
  } = state;

  const isError = customPredictionError.error.length > 0;

  return {
    county,
    countyTrappingsData,
    customPrediction,
    dataMode,
    error: customPredictionError,
    isError,
    isLoading: fetchingCustomPrediction,
    rangerDistrict,
    rangerDistrictTrappingsData,
    selectedState,
    year,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
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
