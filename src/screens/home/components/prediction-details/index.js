import { connect } from 'react-redux';

import PredictionDetails from './component';

import { setPredictionModal } from '../../../../state/actions';

const mapStateToProps = (state) => {
  const {
    selections: {
      dataMode,
      predictionModal,
    },
    data: {
      predictions,
    },
  } = state;

  const probSpotsGT50 = predictions && predictions.length > 0 ? predictions[0].probSpotsGT50 : null;

  return {
    dataMode,
    data: predictions,
    isOpen: predictionModal,
    probSpotsGT50,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch(setPredictionModal(false));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PredictionDetails);
