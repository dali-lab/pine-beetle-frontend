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

  const chartData = {
    type: 'roundedBar',
    labels: ['0', '>0', '>19', '>53', '>147'],
    datasets: [{
      data: inputData, // updated data goes here
      backgroundColor: ['#FF4954', '#FF9B53', '#FFCF53', '#5383FF', '#6FDCFF'],
      // borderColor
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    barRoundness: 1,
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
    // tooltips: {
    //   mode: 'index',
    //   intersect: false,
    // },

  useEffect(() => {
    // sum up spots by year
    // const spotMap = data.reduce((acc, curr) => ({
    //   ...acc,
    //   [curr.year]: curr.spots + acc[curr.year],
    // }), getYear(startDate, endDate).reduce((p, c) => ({ ...p, [c]: 0 }), {}));
    // console.log(data);
    // we need 6 numbers for our data
    setInputData(data);
  }, [data]);

  return (
    <div style={{ width: '40vw' }}>
      <Bar data={chartData} height={400} options={chartOptions} />
    </div>
  );
};

export default BarChart;
