import { connect } from 'react-redux';

import StateMap from './component';

import {
  setCounty,
  setRangerDistrict,
  setState,
} from '../../../../state/actions';

const mapStateToProps = (state) => {
  const {
    selections: {
      county,
      dataMode,
      rangerDistrict,
      state: selectedState,
      year,
    },
    predictions: {
      data: predictionsData,
      rangerDistrict: allRangerDistrictData,
    },
  } = state;

  const allCounties = [...new Set(predictionsData.map((obj => obj.county)))];
  const allRangerDistricts = [...new Set(allRangerDistrictData.map((obj => obj.rangerDistrict)))];
  const allStates = [...new Set(predictionsData.map((obj => obj.state)))];

  return {
    allCounties,
    allRangerDistricts,
    allStates,
    county,
    dataMode,
    predictionsData,
    rangerDistrict,
    selectedState,
    year,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCounty: (county) => {
      dispatch(setCounty(county));
    },
    setRangerDistrict: (rangerDistrict) => {
      dispatch(setRangerDistrict(rangerDistrict));
    },
    setState: (state) => {
      dispatch(setState(state));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateMap);
