import { connect } from 'react-redux';

import { setChartMode, setDataMode } from '../../state/actions';

import TrappingData from './component';

const mapStateToProps = (state) => {
  const {
    error: {
      trappingError: {
        text: trappingErrorText,
      },
    },
    selections: {
      chartMode,
      dataMode,
    },
    trappings: {
      data: trappingData,
      fetchingCounty,
      fetchingRangerDistrict,
    },
  } = state;

  const isLoading = fetchingCounty && fetchingRangerDistrict;

  return {
    chartMode,
    isLoading,
    trappingData,
    trappingErrorText,
    dataMode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
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
