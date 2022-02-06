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

  return {
    data: predictions,
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
