import { connect } from 'react-redux';
import ObservedOutcomes from './component';
import { getAvailableYears } from '../../state/actions';
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
    },
  } = state;

  return {
    // loading while either dataset is being fetched
    isLoading: fetchingResultsComparisonData || fetchingScatterChartData,
    // consider page "has data" only when both datasets are present
    hasData: (resultsComparison && resultsComparison.length > 0)
      && (scatterChart && scatterChart.length > 0),
    predictionYear,
    yearsLoaded: availablePredictionYears && availablePredictionYears.length > 0,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchAvailableYears: () => dispatch(getAvailableYears()),
  fetchData: (year) => {
    dispatch(fetchAllObservedOutcomesData(year));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ObservedOutcomes);
