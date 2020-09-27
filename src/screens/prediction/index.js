import { connect } from 'react-redux';

import Prediction from './component';

const mapStateToProps = (state) => {
  const {
    selections: {
      state: selectedState,
    },
  } = state;

  return {
    selectedState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Prediction);
