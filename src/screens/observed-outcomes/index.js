import { connect } from 'react-redux';
import ObservedOutcomes from './component';
import { ActionTypes, getAvailableYears } from '../../state/actions';
import { fetchAllObservedOutcomesData } from '../../state/actions/data';

const mapStateToProps = (state) => {
  const {
    data: {
      fetchingResultsComparisonData,
      fetchingScatterChartData,
      resultsComparison,
      scatterChart,
    },
    selections: {
      predictionYear,
      availablePredictionYears,
      dataMode,
    },
  } = state;

  return {
    // loading while either dataset is being fetched
    isLoading: fetchingResultsComparisonData || fetchingScatterChartData,
    // consider page "has data" only when both datasets are present
    hasData: (resultsComparison && resultsComparison.length > 0)
      && (scatterChart && scatterChart.length > 0),
    predictionYear,
    dataMode,
    yearsLoaded: availablePredictionYears && availablePredictionYears.length > 0,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchAvailableYears: () => dispatch(getAvailableYears()),
  fetchData: (year) => {
    dispatch(fetchAllObservedOutcomesData(year));
  },
  // Filter-only versions (don't clear data or fetch new data)
  clearFilters: () => {
    dispatch({ type: ActionTypes.SET_STATE, payload: { state: '' } });
    dispatch({ type: ActionTypes.SET_COUNTY_FILTER, payload: { county: [] } });
    dispatch({ type: ActionTypes.SET_RANGER_DISTRICT_FILTER, payload: { rangerDistrict: [] } });
  },
  setStateFilter: (state) => {
    dispatch({ type: ActionTypes.SET_STATE, payload: { state } });
  },
  setCountyFilter: (county) => {
    dispatch({ type: ActionTypes.SET_COUNTY_FILTER, payload: { county } });
  },
  setRangerDistrictFilter: (rangerDistrict) => {
    dispatch({ type: ActionTypes.SET_RANGER_DISTRICT_FILTER, payload: { rangerDistrict } });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ObservedOutcomes);
