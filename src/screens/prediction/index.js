import { connect } from 'react-redux';

import Prediction from './component';

const mapStateToProps = (state) => {
  const {
    error: {
      predictionsError: {
        text: predictionsErrorText,
      },
    },
    predictions: {
      data: predictionData,
      fetchingCounty,
      fetchingRangerDistrict,
    },
    selections: {
      state: selectedState,
    },
  } = state;

  const isLoading = fetchingCounty && fetchingRangerDistrict;

  return {
    isLoading,
    predictionData,
    predictionsErrorText,
    selectedState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Prediction);
