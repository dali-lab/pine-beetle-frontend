import { connect } from 'react-redux';
import ScatterChart from './component';

const mapStateToProps = (state) => {
  const {
    data: {
      scatterChart,
      fetchingScatterChartData,
    },
    selections: {
      predictionYear,
      dataMode,
      state: selectedState,
      county,
      rangerDistrict,
    },
  } = state;

  return {
    data: scatterChart,
    isLoading: fetchingScatterChartData,
    predictionYear,
    dataMode,
    selectedState,
    county,
    rangerDistrict,
  };
};

export default connect(
  mapStateToProps,
  null
)(ScatterChart);
