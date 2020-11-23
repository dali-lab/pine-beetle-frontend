import { connect } from 'react-redux';

import PredictionDetails from './component';

const mapStateToProps = (state) => {
  const {
    selections: {
      dataMode,
    },
  } = state;

  return {
    dataMode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PredictionDetails);
