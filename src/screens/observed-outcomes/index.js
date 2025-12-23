import { connect } from 'react-redux';
import ObservedOutcomes from './component';
import {
  getAvailableYears,
  getObservedOutcomesData,
  getScatterChartData,
} from '../../state/actions';

const mapStateToProps = (state) => {
  const {
    data: {
      fetchingResultsComparisonData,
      resultsComparisonData,
    },
    selections: {
      predictionYear,
      availablePredictionYears,
    },
  } = state;

  return {
    isLoading: fetchingResultsComparisonData,
    hasData: resultsComparisonData && resultsComparisonData.length > 0,
    predictionYear,
    yearsLoaded: availablePredictionYears && availablePredictionYears.length > 0,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchAvailableYears: () => dispatch(getAvailableYears()),
  fetchData: (year) => {
    dispatch(getObservedOutcomesData(year));
    dispatch(getScatterChartData());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ObservedOutcomes);
