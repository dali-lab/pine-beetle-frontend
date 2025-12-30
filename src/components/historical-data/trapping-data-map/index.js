import { connect } from 'react-redux';

import StateMap from './component';

import {
  ActionTypes,
  getAggregateLocationData,
  getAvailableSublocations,
  setCounty,
  setRangerDistrict,
  setState,
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
    predictionYear: state.selections.predictionYear || endYear,
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
      dispatch(getAvailableSublocations(state, {}, { historical: true, prediction: false }));
    },
    clearAllSelections: () => {
      dispatch((thunkDispatch, getState) => {
        const stateBeforeClear = getState();
        const latestYear = stateBeforeClear.selections.availableHistoricalYears?.length > 0
          ? stateBeforeClear.selections.availableHistoricalYears[stateBeforeClear.selections.availableHistoricalYears.length - 1]
          : stateBeforeClear.selections.endYear;

        thunkDispatch({ type: ActionTypes.CLEAR_SELECTIONS });
        thunkDispatch(getAvailableSublocations('', {}, { historical: true, prediction: false }));

        if (latestYear) {
          thunkDispatch(getAggregateLocationData({ year: latestYear }));
        }
      });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StateMap);
