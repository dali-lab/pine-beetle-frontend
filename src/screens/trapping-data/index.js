import { connect } from 'react-redux';

import { setChartMode } from '../../state/actions';

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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setChartMode: () => {
      dispatch(setChartMode());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrappingData);
