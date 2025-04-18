import { connect } from 'react-redux';

import { setPredictionYear } from '../../../../state/actions';
import ScatterChartSelectionBar from './component';

const mapStateToProps = (state) => {
  const {
    selections: {
      predictionYear: year,
      availablePredictionYears,
    },
  } = state;

  return {
    availableYears: availablePredictionYears,
    year,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPredictionYear: (year) => {
      dispatch(setPredictionYear(year));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScatterChartSelectionBar);
