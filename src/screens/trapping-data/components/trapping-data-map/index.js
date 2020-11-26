import { connect } from 'react-redux';

import StateMap from './component';

import {
  setCounty,
  setRangerDistrict,
  setState,
} from '../../../../state/actions';

import { DATA_MODES } from '../../../../constants';

const mapStateToProps = (state) => {
  const {
    selections: {
      county,
      dataMode,
      rangerDistrict,
      state: selectedState,
      year,
      yearRange: {
        startYear,
        endYear,
      },
    },
    trappings: {
      county: allCountyData,
      data: trappingData,
      rangerDistrict: allRangerDistrictData,
    },
  } = state;

  const allCounties = [...new Set(trappingData.map((obj => obj.county)))];
  const allRangerDistricts = [...new Set(allRangerDistrictData.map((obj => obj.rangerDistrict)))];
  const allSelectedStates = [...new Set(trappingData.map((obj => obj.state)))];

  const allRelevantData = dataMode === DATA_MODES.COUNTY ? allCountyData : allRangerDistrictData;
  const allTotalStates = [...new Set(allRelevantData.filter(obj => obj.year >= startYear && obj.year <= endYear).map(obj => obj.state))];

  return {
    allCounties,
    allRangerDistricts,
    allSelectedStates,
    allTotalStates,
    county,
    dataMode,
    endYear,
    rangerDistrict,
    selectedState,
    startYear,
    trappingData,
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
