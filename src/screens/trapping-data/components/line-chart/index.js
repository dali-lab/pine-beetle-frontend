import { connect } from 'react-redux';

import LineChart from './component';

const mapStateToProps = (state) => {
  const {
    data: {
      yearData,
    },
    selections: {
      startYear,
      endYear,
    },
  } = state;

  return {
    yearData,
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
