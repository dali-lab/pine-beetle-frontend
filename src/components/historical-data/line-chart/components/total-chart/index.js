import { connect } from 'react-redux';
import TotalChart from './component';

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
)(TotalChart);
