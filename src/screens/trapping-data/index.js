import { connect } from 'react-redux';

import { setChartMode } from '../../state/actions';

import TrappingData from './component';

const mapStateToProps = (state) => {
  const {
    error: {
      fetchError: {
        text: errorText,
      },
    },
    selections: {
      chartMode,
    },
    data: {
      fetchingAggregateYearData,
      fetchingAggregateStateData,
      fetchingAggregateLocationData,
    },
  } = state;

  const isLoading = fetchingAggregateYearData || fetchingAggregateStateData || fetchingAggregateLocationData;

  return {
    chartMode,
    isLoading,
    errorText,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setChartMode: (mode) => {
      dispatch(setChartMode(mode));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrappingData);
