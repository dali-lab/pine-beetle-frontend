import { connect } from 'react-redux';

import SelectionBar from './component';

import {
  clearSelections,
  setCounty,
  setCounties,
  setRangerDistrict,
  setFederalLands,
  setState,
  setYearRange,
} from '../../../../state/actions';

const mapStateToProps = (state) => {
  const {
    selections: {
      yearRange: {
        startYear,
        endYear,
      },
      state: selectedState,
      county,
      counties,
      rangerDistrict,
      federalLands,
      dataMode,
    },
    trappings: {
      data: trappingData,
    },
  } = state;

  return {
    county,
    counties,
    endYear,
    rangerDistrict,
    federalLands,
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
    setStartYear: (startYear) => {
      dispatch(setYearRange(startYear, undefined));
    },
    setEndYear: (endYear) => {
      dispatch(setYearRange(undefined, endYear));
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
