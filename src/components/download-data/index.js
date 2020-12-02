import { connect } from 'react-redux';

import DownloadData from './component';

import {
  clearSelections,
  setAllYears,
  setCounty,
  setDataMode,
  setRangerDistrict,
  setState,
  setYearRange,
} from '../../state/actions';

const mapStateToProps = (state) => {
  const {
    selections: {
      yearRange: {
        startYear,
        endYear,
      },
      state: selectedState,
      county,
      rangerDistrict,
      dataMode,
    },
    trappings: {
      data: trappingData,
    },
  } = state;

  return {
    county,
    endYear,
    rangerDistrict,
    selectedState,
    startYear,
    trappingData,
    dataMode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearAllSelections: () => {
      dispatch(clearSelections());
    },
    setAllYears: () => {
      dispatch(setAllYears());
    },
    setStartYear: (startYear) => {
      dispatch(setYearRange(startYear, undefined));
    },
    setEndYear: (endYear) => {
      dispatch(setYearRange(undefined, endYear));
    },
    setCounty: (county) => {
      dispatch(setCounty(county));
    },
    setDataMode: (dataMode) => {
      dispatch(setDataMode(dataMode));
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
)(DownloadData);
