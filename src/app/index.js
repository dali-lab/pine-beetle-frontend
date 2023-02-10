import { connect } from 'react-redux';

import {
  getAggregateYearData,
  getAggregateStateData,
  getAggregateLocationData,
  getAvailableStates,
  getSparseData,
  getPredictions,
  getUserFromStorage,
  setChartMode,
  setDataMode,
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
    getSparseData: (overrideFilter) => {
      dispatch(getSparseData(overrideFilter));
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
    setDataMode: (mode) => {
      dispatch(setDataMode(mode));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
