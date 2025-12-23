import { connect } from 'react-redux';

import {
  getAggregateYearData,
  getAggregateStateData,
  getAggregateLocationData,
  getAvailableStates,
  getAvailableYears,
  getAllBlogPosts,
  getSparseData,
  getPredictions,
  getUserFromStorage,
  setChartMode,
  setDataMode,
  getObservedOutcomesData,
  getScatterChartData,
} from '../state/actions';

import App from './component';

const mapStateToProps = (state) => {
  const {
    selections: {
      startYear,
      predictionYear,
      chartMode,
    },
  } = state;

  return {
    startYear,
    predictionYear,
    chartMode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAggregateYearData: () => {
      dispatch(getAggregateYearData());
    },
    getAggregateStateData: () => {
      dispatch(getAggregateStateData());
    },
    getAggregateLocationData: () => {
      dispatch(getAggregateLocationData());
    },
    getAvailableStates: (overrideFilter) => {
      dispatch(getAvailableStates(overrideFilter));
    },
    getAllBlogPosts: () => {
      dispatch(getAllBlogPosts());
    },
    getSparseData: (overrideFilter) => {
      dispatch(getSparseData(overrideFilter));
    },
    getObservedOutcomesData: (year) => {
      dispatch(getObservedOutcomesData(year));
    },
    getPredictions: (startYear, endYear) => {
      dispatch(getPredictions(startYear, endYear));
    },
    loginUserFromStorage: () => {
      dispatch(getUserFromStorage());
    },
    setChartMode: (mode) => {
      dispatch(setChartMode(mode));
    },
    setDataMode: (mode, options) => {
      dispatch(setDataMode(mode, options));
    },
    getScatterChartData: () => {
      dispatch(getScatterChartData());
    },
    getAvailableYears: () => {
      dispatch(getAvailableYears());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
