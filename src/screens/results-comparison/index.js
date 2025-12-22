import { connect } from 'react-redux';
import ResultsComparison from './component';
import {
  getAvailableYears,
  getResultsComparisonData,
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
    dispatch(getResultsComparisonData(year));
    dispatch(getScatterChartData());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultsComparison);
