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
      endYear: year,
    },
    data: {
      customPrediction,
      fetchingCustomPrediction,
    },
    error: {
      customPredictionError,
    },
  } = state;

  const isError = customPredictionError.error.length > 0;

  return {
    county: county[0],
    customPrediction,
    dataMode,
    error: customPredictionError,
    isError,
    isLoading: fetchingCustomPrediction,
    rangerDistrict: rangerDistrict[0],
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
