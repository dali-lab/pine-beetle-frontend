import { connect } from 'react-redux';

import ScatterChart from './component';

const mapStateToProps = (state) => {
  const {
    data: {
      scatterChart,
    },
  } = state;

  return {
    data: scatterChart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScatterChart);
