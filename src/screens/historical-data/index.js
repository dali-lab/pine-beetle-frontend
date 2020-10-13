import { connect } from 'react-redux';

import HistoricalData from './component';

const mapStateToProps = (state) => {
  const {
    trappings: {
      data: trappingData,
    },
  } = state;

  return {
    trappingData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoricalData);
