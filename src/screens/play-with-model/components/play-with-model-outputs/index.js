import { connect } from 'react-redux';

import PlayWithModelOutputs from './component';

const mapStateToProps = (state) => {
  const {
    error: {
      customPredictionError,
    },
    data: {
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

const mapDispatchToProps = (_dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayWithModelOutputs);
