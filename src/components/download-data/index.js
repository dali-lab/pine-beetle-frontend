import { connect } from 'react-redux';

import DownloadData from './component';

import {
  clearSelections,
  setAllYears,
  setCounty,
  setDataMode,
  setEndYear,
  setRangerDistrict,
  setStartYear,
  setState,
} from '../../state/actions';

const mapStateToProps = (state) => {
  const {
    selections: {
      startYear,
      endYear,
      state: selectedState,
      county,
      rangerDistrict,
      dataMode,
      availableYears,
      availableStates,
      availableSublocations,
    },
  } = state;

  return {
    availableYears,
    availableStates,
    availableSublocations,
    county,
    endYear,
    rangerDistrict,
    selectedState,
    startYear,
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
      dispatch(setStartYear(startYear));
    },
    setEndYear: (endYear) => {
      dispatch(setEndYear(endYear));
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
