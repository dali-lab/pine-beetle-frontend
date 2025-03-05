import { connect } from 'react-redux';
import ResultsComparison from './component';

const mapStateToProps = (state) => {
  const {
    data: {
      fetchingResultsComparisonData,
    },
  } = state;

  return {
    isLoading: fetchingResultsComparisonData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultsComparison);
