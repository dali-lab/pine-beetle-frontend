import { connect } from 'react-redux';

import PredictionChart from './component';

const mapStateToProps = (state) => {
  const {
    data: {
      predictions,
      yearData,

    },
    selections: {
      startYear,
      endYear,
    },
  } = state;

  return {
    yearData,
    predictions,
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
)(PredictionChart);
