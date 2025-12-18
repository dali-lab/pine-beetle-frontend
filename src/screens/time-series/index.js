import { connect } from 'react-redux';

import {
  clearSelections,
  getAvailableYears,
  getAggregateYearData,
  getAggregateLocationData,
  setChartMode,
  setDataMode,
  setStartYear,
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
    },
    data: {
      fetchingAggregateYearData,
      fetchingAggregateLocationData,
      yearData,
    },
  } = state;

  const hasGraphData = yearData && yearData.length > 0;
  const isGraphView = chartMode === 'graph';

  // Show loader when fetching data
  const isLoading = isGraphView
    ? (fetchingAggregateYearData && !hasGraphData)
    : fetchingAggregateLocationData;

  // Map view uses predictionYear, chart view uses endYear
  const mapYear = predictionYear || endYear;

  return {
    chartMode,
    dataMode,
    isLoading,
    errorText,
    availableYears: availableHistoricalYears,
    endYear,
    mapYear,
  };
};

const mapDispatchToProps = (dispatch) => ({
  clearAllSelections: () => dispatch(clearSelections({ skipDataFetch: true })),
  setChartMode: (mode) => dispatch(setChartMode(mode)),
  setDataMode: (mode) => dispatch(setDataMode(mode)),
  setStartYear: (year) => dispatch(setStartYear(year)),
  fetchAvailableYears: () => dispatch(getAvailableYears()),
  fetchGraphData: () => dispatch(getAggregateYearData()),
  fetchMapData: (year) => dispatch(getAggregateLocationData({ year })),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimeSeries);
