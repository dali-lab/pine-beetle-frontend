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
    },
    data: {
      data,
    },
  } = state;

  const predictionsData = data.filter(({ isValidForPrediction }) => !!isValidForPrediction);

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
