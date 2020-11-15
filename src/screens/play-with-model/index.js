import { connect } from 'react-redux';

import { clearCustomPredictionError, runCustomPrediction } from '../../state/actions';

import PlayWithModel from './component';

const mapStateToProps = (state) => {
  const {
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
    customPrediction,
    error: customPredictionError,
    isError,
    isLoading: fetchingCustomPrediction,
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
