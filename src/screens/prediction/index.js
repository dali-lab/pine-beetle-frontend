import { connect } from 'react-redux';
import { setPredictionModal } from '../../state/actions';

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
    selections: {
      predictionModal,
    },
  } = state;

  const isLoading = fetchingPredictions;

  return {
    data: predictions,
    fetchErrorText,
    isLoading,
    predictionModal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPredictionModal: (show) => {
      dispatch(setPredictionModal(show));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Prediction);
