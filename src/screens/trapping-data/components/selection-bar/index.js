import { connect } from 'react-redux';

import SelectionBar from './component';

import {
  clearSelections,
  setCounty,
  // setDataMode,
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
      availableHistoricalYears,
      availableHistoricalStates,
      availableHistoricalSublocations,
    },
  } = state;

  return {
    availableYears: availableHistoricalYears,
    availableStates: availableHistoricalStates,
    availableSublocations: availableHistoricalSublocations,
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
