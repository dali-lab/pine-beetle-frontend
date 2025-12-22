import { connect } from 'react-redux';

import FilterBar from './component';

import {
  clearSelections,
  setCounty,
  setDataMode,
  setEndYear,
  setPredictionYear,
  setRangerDistrict,
  setStartYear,
  setState,
} from '../../state/actions';

const mapStateToProps = (state, ownProps) => {
  const {
    selections: {
      predictionYear: year,
      startYear,
      endYear,
      state: selectedState,
      county,
      rangerDistrict,
      dataMode,
      chartMode,
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
    chartMode,
    predictionYear: year,
    startYear,
    endYear,
    useHistoricalData: useHistorical,
  };
};

const mapDispatchToProps = (dispatch) => ({
  clearAllSelections: () => {
    dispatch(clearSelections());
  },
  setPredictionYear: (year) => {
    dispatch(setPredictionYear(year));
  },
  setStartYear: (year) => {
    dispatch(setStartYear(year));
  },
  setEndYear: (year) => {
    dispatch(setEndYear(year));
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
