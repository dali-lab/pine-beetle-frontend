import { connect } from 'react-redux';

import {
  clearSelections,
  setChartMode,
  setDataMode,
  setStartYear,
} from '../../state/actions';

import HistoricalView from './component';

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
      predictionYear,
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
    predictionYear,
    availableYears: availableHistoricalYears,
  };
};

const mapDispatchToProps = (dispatch) => ({
  clearAllSelections: () => dispatch(clearSelections()),
  setChartMode: (mode) => dispatch(setChartMode(mode)),
  setDataMode: (mode) => dispatch(setDataMode(mode)),
  setStartYear: (year) => dispatch(setStartYear(year)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalView);
