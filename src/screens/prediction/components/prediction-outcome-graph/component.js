import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

import { getYearRange } from '../../../../constants';

import './style.scss';

const PredictionChart = (props) => {
  const {
    yearData = [],
    predictions,
    startYear,
    // endYear,
    predictionYear,
  } = props;

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Outcomes',
        fill: false,
      },
      {
        data: [],
        label: 'Predictions',
        fill: false,
      },
    ],
  });

  // eslint-disable-next-line no-unused-vars
  const [chartOptions, setChartOptions] = useState({
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Year',
          fontColor: '#7c7c96',
          fontFamily: 'Inter',
          fontSize: '22',
          padding: '8',
        },
        ticks: {
          fontFamily: 'Roboto',
          fontSize: '10',
          fontColor: '#a3a3a3',
        },
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Number of Spots',
          fontColor: '#7c7c96',
          fontFamily: 'Inter',
          fontSize: '22',
          padding: '8',
        },
        ticks: {
          max: 1000,
          min: 0,
          fontFamily: 'Roboto',
          fontSize: '10',
          fontColor: '#a3a3a3',
        },
      }],
    },
    tooltips: {
      // TODO: make tooltip hover over points on graph
      enabled: true,
      mode: 'index',
      intersect: false,
      backgroundColor: '#545354',
      displayColors: false,

      titleFontFamily: 'Inter',
      titleFontColor: '#ffffff',
      titleAlign: 'center',

      bodyFontFamily: 'Inter',
      bodyFontColor: '#ffffff',
      bodyAlign: 'left',

      // set custom label (rounds spb and clerid per 2 weeks)
      callbacks: {
        label: (tooltipItem, d) => {
          const { label } = d.datasets[tooltipItem.datasetIndex];
          const value = tooltipItem.yLabel;

          if (label === 'Total Spots') return `${label}: ${value}`;
          else return `${label}: ${value.toFixed(2)}`;
        },
      },
    },
    legend: {
      display: true,
      position: 'top',
    },
  });

  useEffect(() => {
    const updatedChartData = {
      labels: [],
      datasets: [
        {
          data: [],
          label: 'Outcomes',
          borderColor: '#5383ff',
          backgroundColor: '#5383ff',
          fill: false,
          lineTension: 0,
          borderDash: [10, 5],
        },
        {
          data: [],
          label: 'Predictions',
          borderColor: '#ff525c',
          backgroundColor: '#ff525c',
          fill: false,
          lineTension: 0,
          borderDash: [5, 1],
        },
      ],
    };

    const updatedChartOptions = {
      ...chartOptions,
    };

    updatedChartData.labels = getYearRange(startYear, predictionYear);
    // get sum of spots by year - outcomes
    const spotMap = yearData.reduce((acc, { year, avgSpotst0 }) => ({
      ...acc,
      [year]: avgSpotst0,
    }), getYearRange(startYear, predictionYear).reduce((p, c) => ({ ...p, [c]: null }), {}));

    // get predictions to compare
    const predictionData = predictions.reduce((acc, { year, expSpotsIfOutbreak }) => ({
      ...acc,
      [year]: expSpotsIfOutbreak,
    }), getYearRange(startYear, predictionYear).reduce((p, c) => ({ ...p, [c]: null }), {}));


    // update chartData
    updatedChartData.datasets[0].data = Object.values(spotMap);
    updatedChartData.datasets[1].data = Object.values(predictionData);

    // maximum value found in the array
    const max = Math.max(...[
      ...updatedChartData.datasets[0].data,
      ...updatedChartData.datasets[1].data,
    ]);

    // set new y-axis height
    updatedChartOptions.scales.yAxes[0].ticks.max = max;


    setChartData(updatedChartData);
    setChartOptions(updatedChartOptions);
  }, [predictionYear, startYear]);

  return (
    <div id="chart">
      <Line data={chartData} height={400} options={chartOptions} />
    </div>
  );
};

export default PredictionChart;
