import { connect } from 'react-redux';

import SelectionBar from './component';

import {
  clearSelections,
  setCounty,
  setRangerDistrict,
  setState,
  setYear,
} from '../../../../state/actions';

const mapStateToProps = (state) => {
  const {
    selections: {
      year,
      state: selectedState,
      county,
      rangerDistrict,
      dataMode,
    },
    predictions: {
      data: predictionsData,
    },
  } = state;

  return {
    county,
    rangerDistrict,
    selectedState,
    predictionsData,
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
