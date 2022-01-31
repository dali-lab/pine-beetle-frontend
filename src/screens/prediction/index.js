import { connect } from 'react-redux';

import Prediction from './component';

const mapStateToProps = (state) => {
  const {
    error: {
      fetchError: {
        text: fetchErrorText,
      },
    },
    data: {
      data,
      fetchingCounty,
      fetchingRangerDistrict,
    },
    selections: {
      state: selectedState,
      endYear,
    },
  } = state;

  const isLoading = fetchingCounty && fetchingRangerDistrict;
  const predictionData = data.filter(({ isValidForPrediction, year }) => !!isValidForPrediction && year === endYear);

  return {
    data: predictionData,
    fetchErrorText,
    isLoading,
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
