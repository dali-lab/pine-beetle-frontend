import { connect } from 'react-redux';

import { runCustomPrediction } from '../../state/actions';

import PlayWithModel from './component';

const mapStateToProps = (state) => {
  const {
    predictions: {
      customPrediction,
    },
  } = state;

  return {
    customPrediction,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    runCustomPrediction: (cleridst1, spotst1, spotst2, SPB, endobrev) => {
      dispatch(runCustomPrediction(cleridst1, spotst1, spotst2, SPB, endobrev));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayWithModel);
