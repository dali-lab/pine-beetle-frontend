import { connect } from 'react-redux';

import StateMap from './component';

import {
  setCounty,
  setRangerDistrict,
  setState,
} from '../../../../state/actions';

const mapStateToProps = (state) => {
  const {
    selections: {
      county,
      dataMode,
      rangerDistrict,
      state: selectedState,
      startYear,
      endYear,
      availableHistoricalStates,
      availableHistoricalSublocations,
    },
    data: {
      sublocationData,
    },
  } = state;

  return {
    availableStates: availableHistoricalStates,
    availableSublocations: availableHistoricalSublocations,
    county: county[0],
    dataMode,
    endYear,
    rangerDistrict: rangerDistrict[0],
    selectedState,
    startYear,
    sublocationData,
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
