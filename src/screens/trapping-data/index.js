import { connect } from 'react-redux';

import TrappingData from './component';

const mapStateToProps = (state) => {
  const {
    error: {
      trappingError: {
        text: trappingErrorText,
      },
    },
    trappings: {
      data: trappingData,
      fetchingCounty,
      fetchingRangerDistrict,
    },
  } = state;

  const isLoading = fetchingCounty && fetchingRangerDistrict;

  return {
    isLoading,
    trappingData,
    trappingErrorText,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrappingData);
