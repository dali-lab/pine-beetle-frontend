import { connect } from 'react-redux';

import {
  clearSelections,
  setChartMode,
  setDataMode,
  setStartYear,
} from '../../state/actions';

import HistoricalGraphView from './component';

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
      startYear,
      endYear,
      availableHistoricalYears,
    },
    data: {
      fetchingAggregateYearData,
      fetchingAggregateStateData,
      fetchingAggregateLocationData,
    },
  } = state;

  const isLoading = fetchingAggregateYearData || fetchingAggregateStateData || fetchingAggregateLocationData;

  return {
    chartMode,
    dataMode,
    isLoading,
    errorText,
    startYear,
    endYear,
    availableYears: availableHistoricalYears,
  };
};

const mapDispatchToProps = (dispatch) => ({
  clearAllSelections: () => {
    dispatch(clearSelections());
  },
  setChartMode: (mode) => {
    dispatch(setChartMode(mode));
  },
  setDataMode: (dataMode) => {
    dispatch(setDataMode(dataMode));
  },
  setStartYear: (year) => {
    dispatch(setStartYear(year));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoricalGraphView);
