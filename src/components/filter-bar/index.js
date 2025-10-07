import { connect } from 'react-redux';

import FilterBar from './component';

import {
  clearSelections,
  setCounty,
  setDataMode,
  setPredictionYear,
  setRangerDistrict,
  setState,
} from '../../state/actions';

const mapStateToProps = (state, ownProps) => {
  const {
    selections: {
      predictionYear: year,
      state: selectedState,
      county,
      rangerDistrict,
      dataMode,
      availablePredictionYears,
      availablePredictionStates,
      availablePredictionSublocations,
      availableHistoricalYears,
      availableHistoricalStates,
      availableHistoricalSublocations,
    },
  } = state;

  // Use historical data if useHistoricalData prop is passed, otherwise use prediction data
  const useHistorical = ownProps.useHistoricalData;

  return {
    availableYears: useHistorical ? availableHistoricalYears : availablePredictionYears,
    availableStates: useHistorical ? availableHistoricalStates : availablePredictionStates,
    availableSublocations: useHistorical ? availableHistoricalSublocations : availablePredictionSublocations,
    county,
    rangerDistrict,
    selectedState,
    dataMode,
    predictionYear: year,
  };
};

const mapDispatchToProps = (dispatch) => ({
  clearAllSelections: () => {
    dispatch(clearSelections());
  },
  setPredictionYear: (year) => {
    dispatch(setPredictionYear(year));
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
  setDataMode: (mode) => {
    dispatch(setDataMode(mode));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterBar);
