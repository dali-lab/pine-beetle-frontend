import { connect } from 'react-redux';

import { clearCustomPredictionError, runCustomPrediction } from '../../state/actions';

import { DATA_MODES } from '../../constants';

import PlayWithModel from './component';

const mapStateToProps = (state) => {
  const {
    selections: {
      county,
      dataMode,
      rangerDistrict,
      state: selectedState,
      endYear: year,
    },
    data: {
      county: countyData,
      rangerDistrict: rangerDistrictData,
      customPrediction,
      fetchingCustomPrediction,
    },
    error: {
      customPredictionError,
    },
  } = state;

  const isError = customPredictionError.error.length > 0;
  const fullData = dataMode === DATA_MODES.COUNTY ? countyData : rangerDistrictData;

  return {
    county,
    customPrediction,
    dataMode,
    error: customPredictionError,
    fullData,
    isError,
    isLoading: fetchingCustomPrediction,
    rangerDistrict,
    selectedState,
    year,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearError: () => {
      dispatch(clearCustomPredictionError());
    },
    runCustomPrediction: (cleridst1, spotst1, spotst2, SPB, endobrev) => {
      dispatch(runCustomPrediction(cleridst1, spotst1, spotst2, SPB, endobrev));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayWithModel);
