import { connect } from 'react-redux';

import LineChart from './component';

const mapStateToProps = (state) => {
  const {
    data: {
      data,
    },
    selections: {
      startYear,
      endYear,
    },
  } = state;

  return {
    data,
    startYear,
    endYear,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LineChart);
