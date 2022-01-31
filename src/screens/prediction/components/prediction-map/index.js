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
      endYear: year,
    },
    data: {
      county: allCountyData,
      data: rawData,
      rangerDistrict: allRangerDistrictData,
    },
  } = state;

  const data = rawData.filter(doc => !!doc.isValidForPrediction && doc.year === year);

  const allCounties = [...new Set(data.map(obj => obj.county))];
  const allRangerDistricts = [...new Set(allRangerDistrictData.map(obj => obj.rangerDistrict))];
  const allSelectedStates = [...new Set(data.map(obj => obj.state))];

  const allRelevantData = dataMode === DATA_MODES.COUNTY ? allCountyData : allRangerDistrictData;
  const allTotalStates = [...new Set(allRelevantData.filter(obj => obj.year === year).map(obj => obj.state))];

  return {
    allCounties,
    allRangerDistricts,
    allSelectedStates,
    allTotalStates,
    county,
    dataMode,
    data,
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
