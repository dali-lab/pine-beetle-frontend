import { connect } from 'react-redux';

import { getScatterChartData } from '../../../../state/actions';
import ScatterChart from './component';

const mapStateToProps = (state) => {
  const {
    data: {
      scatterChart,
    },
    selections: {
      predictionYear,
      dataMode,
    },
  } = state;

  return {
    data: scatterChart,
    predictionYear,
    dataMode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getChartData: () => {
      dispatch(getScatterChartData());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScatterChart);
