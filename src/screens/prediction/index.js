import { connect } from 'react-redux';

import Prediction from './component';

import {
  setChartMode,
  clearSelections,
} from '../../state/actions';

const mapStateToProps = (state) => {
  const {
    error: {
      fetchError: {
        text: fetchErrorText,
      },
    },
    data: {
      predictions,
      fetchingPredictions,
    },
    selections: {
      chartMode,
    },
  } = state;

  const isLoading = fetchingPredictions;

  return {
    data: predictions,
    fetchErrorText,
    isLoading,
    chartMode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearAllSelections: () => {
      dispatch(clearSelections());
    },
    setChartMode: (mode) => {
      dispatch(setChartMode(mode));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Prediction);
