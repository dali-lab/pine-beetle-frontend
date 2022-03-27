import { connect } from 'react-redux';

import { setChartMode, setDataMode, clearSelections } from '../../state/actions';

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
      dataMode,
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
    dataMode,
    isLoading,
    errorText,
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
    setDataMode: (dataMode) => {
      dispatch(setDataMode(dataMode));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrappingData);
