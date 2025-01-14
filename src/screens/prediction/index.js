import { connect } from 'react-redux';

import Prediction from './component';

import {
  setChartMode,
  clearSelections,
  setDataMode,
  setPredictionModal,
  setCounty,
  setRangerDistrict,
} from '../../state/actions';

const mapStateToProps = (state) => {
  const {
    error: {
      fetchError: {
        text: fetchErrorText,
      },
    },
    data: {
      predictions,
      fetchingPredictions,
      yearData,
    },
    selections: {
      predictionModal,
      chartMode,
      dataMode,
      county,
      rangerDistrict,
    },
  } = state;

  const isLoading = fetchingPredictions;

  // TODO fill with real data
  const frequencyArray = [
    {
      range: '0-0.025',
      frequency: 1234,
      withBorder: false,
      data: [450, 50, 0, 0, 0, 0, 0],
    },
    {
      range: '0.025-0.05',
      frequency: 1456,
      withBorder: false,
      data: [440, 90, 15, 15, 0, 20, 0],
    },
    {
      range: '0.05-0.15',
      frequency: 678,
      withBorder: false,
      data: [450, 150, 30, 30, 15, 15, 0],
    },
    {
      range: '0.15-0.25',
      frequency: 3456,
      withBorder: false,
      data: [450, 250, 80, 180, 100, 100, 20],
    },
    {
      range: '0.25-0.4',
      frequency: 78,
      withBorder: false,
      data: [450, 300, 100, 230, 150, 130, 50],
    },
    {
      range: '0.4-0.6',
      frequency: 789,
      withBorder: false,
      data: [220, 180, 150, 230, 220, 300, 450],
    },
    {
      range: '0.6-0.8',
      frequency: 1234,
      withBorder: false,
      data: [220, 180, 150, 230, 220, 300, 450],
    },
    {
      range: '0.8-1',
      frequency: 89,
      withBorder: false,
      data: [220, 180, 150, 230, 220, 300, 450],
    },
  ];

  return {
    data: predictions,
    endYear: yearData[yearData.length - 1]?.year,
    fetchErrorText,
    isLoading,
    predictionModal,
    chartMode,
    dataMode,
    county,
    rangerDistrict,
    frequencyArray,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPredictionModal: (show) => {
      dispatch(setPredictionModal(show));
    },
    clearAllSelections: () => {
      dispatch(clearSelections());
    },
    setChartMode: (mode) => {
      dispatch(setChartMode(mode));
    },
    setDataMode: (mode) => {
      dispatch(setDataMode(mode));
    },
    setCounty: (county) => {
      dispatch(setCounty(county));
    },
    setRangerDistrict: (rangerDistrict) => {
      dispatch(setRangerDistrict(rangerDistrict));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Prediction);
