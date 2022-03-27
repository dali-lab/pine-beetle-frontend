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
      predictionYear,
    },
  } = state;

  return {
    yearData,
    predictions,
    startYear,
    endYear,
    predictionYear,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PredictionChart);
