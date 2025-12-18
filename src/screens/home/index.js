import { connect } from 'react-redux';

import Home from './component';

const mapStateToProps = (state) => {
  const {
    data: {
      fetchingPredictions,
      predictions,
    },
  } = state;

  // Home page only needs predictions data for the map
  // Only show loading if we're fetching AND don't have data yet
  const isLoading = fetchingPredictions && (!predictions || predictions.length === 0);

  return {
    isLoading,
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
