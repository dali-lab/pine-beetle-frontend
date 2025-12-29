import { connect } from 'react-redux';

import StateMap from './component';

import {
  setCounty,
  setRangerDistrict,
  setState,
  ActionTypes,
} from '../../../state/actions';

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
    county,
    dataMode,
    startYear,
    endYear,
    predictionYear: state.selections.predictionYear || endYear, // Map uses predictionYear, fallback to endYear
    rangerDistrict,
    selectedState,
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
    setCountyFilter: (county) => {
      dispatch({ type: ActionTypes.SET_COUNTY_FILTER, payload: { county: county === '' ? [] : county } });
    },
    setRangerDistrictFilter: (rangerDistrict) => {
      dispatch({ type: ActionTypes.SET_RANGER_DISTRICT_FILTER, payload: { rangerDistrict: rangerDistrict === '' ? [] : rangerDistrict } });
    },
    setStateFilter: (state) => {
      dispatch({ type: ActionTypes.SET_STATE, payload: { state } });
    },
    clearAllSelections: () => {
      dispatch({ type: ActionTypes.SET_STATE, payload: { state: '' } });
      dispatch({ type: ActionTypes.SET_COUNTY_FILTER, payload: { county: [] } });
      dispatch({ type: ActionTypes.SET_RANGER_DISTRICT_FILTER, payload: { rangerDistrict: [] } });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StateMap);
