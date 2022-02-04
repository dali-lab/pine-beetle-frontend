import { connect } from 'react-redux';

import SelectionBar from './component';

import {
  clearSelections,
  setCounty,
  setDataMode,
  setEndYear,
  setRangerDistrict,
  setStartYear,
  setState,
} from '../../../../state/actions';

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
    dataMode,
    endYear,
    rangerDistrict,
    selectedState,
    startYear,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearSelections: () => {
      dispatch(clearSelections());
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
)(SelectionBar);
