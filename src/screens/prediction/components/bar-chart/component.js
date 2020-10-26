// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-top-round-bar';

// import { getFullYear } from './utils';

// import './style.scss';

// we want a bar graph with prob of 0, >0, ... >147 spots
// reference: https://github.com/chartjs/Chart.js/blob/master/samples/charts/bar/vertical.html
// https://stackoverflow.com/questions/43254153/how-to-create-rounded-bars-for-bar-chart-js-v2

// pass in spot data for that county/rd
const BarChart = (props) => {
  const {
    data = [],
  } = props;

  // data to be put into bar chart
  const [inputData, setInputData] = useState([]);
  const barLabels = ['0', '>0', '>19', '>53', '>147'];
  const barColors = ['#FF4954', '#FF9B53', '#FFCF53', '#5383FF', '#6FDCFF'];

  // function for updating
  const chartData = (input = []) => {
    return ({
      labels: barLabels,
      datasets: [{
        data: input,
        backgroundColor: barColors,
        borderWidth: 1,
      }],
    });
  };

  const chartOptions = {
    maintainAspectRatio: false,
    // barRoundness: 1,
    legend: { display: false },
    scales: {
      xAxes: [{
        barPercentage: 0.4,
        scaleLabel: {
          display: true,
          labelString: 'Spots',
        },
      }],
      yAxes: [{
        ticks: {
          max: 1,
          min: 0,
        },
        scaleLabel: {
          display: true,
          labelString: 'Probability',
        },
      }],
    },
  };

  useEffect(() => {
    const updatedInputData = [
      1 - data[0].prediction['prob.Spots>0'],
      data[0].prediction['prob.Spots>0'],
      data[0].prediction['prob.Spots>19'],
      data[0].prediction['prob.Spots>53'],
      data[0].prediction['prob.Spots>147'],
    ];
    setInputData(updatedInputData);
  }, [data]);

  return (
    <div style={{ width: '40vw' }}>
      <Bar data={chartData(inputData)} height={400} options={chartOptions} />
    </div>
  );
};

export default BarChart;
