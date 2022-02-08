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
      counties,
      rangerDistrict,
      federalLands,
      dataMode,
    },
    trappings: {
      data: trappingData,
      county: countyData,
      rangerDistrict: federalLandData,
      availableHistoricalYears,
      availableHistoricalStates,
      availableHistoricalSublocations,
    },
  } = state;

  return {
    availableYears: availableHistoricalYears,
    availableStates: availableHistoricalStates,
    availableSublocations: availableHistoricalSublocations,
    county: county[0],
    counties,
    federalLands,
    dataMode,
    endYear,
    rangerDistrict: rangerDistrict[0],
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
    setCounties: (counties) => {
      dispatch(setCounties(counties));
    },
    setRangerDistrict: (rangerDistrict) => {
      dispatch(setRangerDistrict(rangerDistrict));
    },
    setFederalLands: (federalLands) => {
      dispatch(setFederalLands(federalLands));
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
