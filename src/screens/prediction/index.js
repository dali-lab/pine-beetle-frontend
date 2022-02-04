import { connect } from 'react-redux';

import Prediction from './component';

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
    },
  } = state;

  const isLoading = fetchingPredictions;

  const predictionData = predictions.filter(({ isValidForPrediction }) => !!isValidForPrediction);

  return {
    data: predictionData,
    fetchErrorText,
    isLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Prediction);
