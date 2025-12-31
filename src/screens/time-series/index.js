import { connect } from 'react-redux';

import {
  getAvailableSublocations,
  getAvailableYears,
  getAggregateYearData,
  getAggregateLocationData,
  setChartMode,
  setDataMode,
  setStartYear,
  ActionTypes,
} from '../../state/actions';

import TimeSeries from './component';

const mapStateToProps = (state) => {
  const {
    error: {
      fetchError: {
        text: errorText,
      },
    },
    selections: {
      chartMode,
      dataMode,
      availableHistoricalYears,
      endYear,
      predictionYear,
      state: selectedState,
      county,
      rangerDistrict,
    },
    data: {
      fetchingAggregateYearData,
      fetchingAggregateLocationData,
      yearData,
    },
  } = state;

  const hasGraphData = yearData && yearData.length > 0;
  const isGraphView = chartMode === 'graph';

  const isLoading = isGraphView
    ? (fetchingAggregateYearData && !hasGraphData)
    : fetchingAggregateLocationData;

  const mapYear = predictionYear || endYear;

  return {
    chartMode,
    dataMode,
    isLoading,
    errorText,
    availableYears: availableHistoricalYears,
    endYear,
    mapYear,
    selectedState,
    county,
    rangerDistrict,
  };
};

const mapDispatchToProps = (dispatch) => ({
  clearAllSelections: () => {
    dispatch((thunkDispatch, getState) => {
      const stateBeforeClear = getState();
      const { selections } = stateBeforeClear;
      const latestYear = selections.availableHistoricalYears?.length > 0
        ? selections.availableHistoricalYears[selections.availableHistoricalYears.length - 1]
        : selections.endYear;
      const { chartMode } = selections;

      thunkDispatch({ type: ActionTypes.CLEAR_SELECTIONS });
      thunkDispatch(getAvailableSublocations('', {}, { historical: true, prediction: false }));

      if (latestYear && chartMode === 'map') {
        thunkDispatch(getAggregateLocationData({ year: latestYear }));
      }
    });
  },
  setChartMode: (mode) => dispatch(setChartMode(mode)),
  setDataMode: (mode) => dispatch(setDataMode(mode)),
  setStartYear: (year) => dispatch(setStartYear(year)),
  fetchAvailableYears: () => dispatch(getAvailableYears()),
  fetchGraphData: () => dispatch(getAggregateYearData()),
  fetchMapData: (year) => dispatch(getAggregateLocationData({ year })),
  clearFilters: () => {
    dispatch((thunkDispatch, getState) => {
      const stateBeforeClear = getState();
      const { selections } = stateBeforeClear;
      const latestYear = selections.availableHistoricalYears?.length > 0
        ? selections.availableHistoricalYears[selections.availableHistoricalYears.length - 1]
        : selections.endYear;
      const { chartMode } = selections;

      thunkDispatch({ type: ActionTypes.CLEAR_SELECTIONS });
      thunkDispatch(getAvailableSublocations('', {}, { historical: true, prediction: false }));

      if (latestYear && chartMode === 'map') {
        thunkDispatch(getAggregateLocationData({ year: latestYear }));
      }
    });
  },
  setStateFilter: (state) => {
    dispatch({ type: ActionTypes.SET_STATE, payload: { state } });
    dispatch(getAvailableSublocations(state, {}, { historical: true, prediction: false }));
  },
  setCountyFilter: (county) => {
    dispatch({ type: ActionTypes.SET_COUNTY_FILTER, payload: { county: county === '' ? [] : county } });
  },
  setRangerDistrictFilter: (rangerDistrict) => {
    dispatch({ type: ActionTypes.SET_RANGER_DISTRICT_FILTER, payload: { rangerDistrict: rangerDistrict === '' ? [] : rangerDistrict } });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TimeSeries);
