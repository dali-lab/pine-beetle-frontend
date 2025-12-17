import { connect } from 'react-redux';

import { getHistogram } from '../../../state/actions';

import Histogram from './component';

const mapStateToProps = (state) => {
  const {
    histogram: {
      histogramData,
    },
  } = state;

  return {
    histogramData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getHistogram: () => {
      dispatch(getHistogram());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Histogram);
