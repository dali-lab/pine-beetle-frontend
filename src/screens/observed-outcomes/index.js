import { connect } from 'react-redux';
import ObservedOutcomes from './component';
import { ActionTypes, getAvailableYears, getAvailableSublocations } from '../../state/actions';
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
    isLoading: fetchingResultsComparisonData || fetchingScatterChartData,
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
  clearFilters: () => {
    dispatch({ type: ActionTypes.SET_STATE, payload: { state: '' } });
    dispatch({ type: ActionTypes.SET_COUNTY_FILTER, payload: { county: [] } });
    dispatch({ type: ActionTypes.SET_RANGER_DISTRICT_FILTER, payload: { rangerDistrict: [] } });
    dispatch(getAvailableSublocations('', {}, { historical: false, prediction: true }));
  },
  setStateFilter: (state) => {
    dispatch({ type: ActionTypes.SET_STATE, payload: { state } });
    dispatch(getAvailableSublocations(state, {}, { historical: false, prediction: true }));
  },
  setCountyFilter: (county) => {
    dispatch({ type: ActionTypes.SET_COUNTY_FILTER, payload: { county } });
  },
  setRangerDistrictFilter: (rangerDistrict) => {
    dispatch({ type: ActionTypes.SET_RANGER_DISTRICT_FILTER, payload: { rangerDistrict } });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ObservedOutcomes);
