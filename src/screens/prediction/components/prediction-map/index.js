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

  const allRangerDistricts = [...new Set(allRangerDistrictData.map((obj => obj.rangerDistrict)))];

  return {
    allRangerDistricts,
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
