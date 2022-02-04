import { connect } from 'react-redux';

import SelectionBar from './component';

import {
  clearSelections,
  setCounty,
  setDataMode,
  setRangerDistrict,
  setState,
  setYear,
} from '../../../../state/actions';

const mapStateToProps = (state) => {
  const {
    selections: {
      endYear: year,
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
    rangerDistrict,
    selectedState,
    dataMode,
    year,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearAllSelections: () => {
      dispatch(clearSelections());
    },
    setYear: (year) => {
      dispatch(setYear(year));
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
