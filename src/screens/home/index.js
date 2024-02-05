import { connect } from 'react-redux';

import Home from './component';

const mapStateToProps = (state) => {
  const {
    data: {
      fetchingAggregateYearData,
      fetchingAggregateStateData,
      fetchingAggregateLocationData,
      fetchingPredictions,
      fetchingSparseData,
    },
  } = state;

  const isLoading = fetchingAggregateYearData
  || fetchingAggregateStateData
  || fetchingAggregateLocationData
  || fetchingPredictions
  || fetchingSparseData;

  return {
    isLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
