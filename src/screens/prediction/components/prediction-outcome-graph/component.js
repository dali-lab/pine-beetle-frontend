import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

import { getYearRange } from '../../../../constants';

import './style.scss';

const PredictionChart = (props) => {
  const {
    yearData = [],
    startYear,
    endYear,
  } = props;

  // eslint-disable-next-line no-unused-vars
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Predictions',
        fill: false,
      },
      {
        data: [],
        label: 'Outcomes',
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
          labelString: 'Count',
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
          label: 'Predictions',
          borderColor: '#5383ff',
          backgroundColor: '#5383ff',
          fill: false,
          lineTension: 0,
          borderDash: [10, 5],
        },
        {
          data: [],
          label: 'Outcomes',
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

    updatedChartData.labels = getYearRange(startYear, endYear);

    // get sum of spots by year
    const spotMap = yearData.reduce((acc, { year, sumSpotst0 }) => ({
      ...acc,
      [year]: sumSpotst0,
    }), getYearRange(startYear, endYear).reduce((p, c) => ({ ...p, [c]: null }), {}));

    // get sum of spb by year
    const spbMap = yearData.reduce((acc, { year, sumSpbPer2Weeks }) => ({
      ...acc,
      [year]: sumSpbPer2Weeks,
    }), getYearRange(startYear, endYear).reduce((p, c) => ({ ...p, [c]: null }), {}));


    // update chartData
    updatedChartData.datasets[0].data = Object.values(spotMap);
    updatedChartData.datasets[1].data = Object.values(spbMap);

    // maximum value found in the array
    const max = Math.max(...[
      ...updatedChartData.datasets[0].data,
      ...updatedChartData.datasets[1].data,
    ]);

    // set new y-axis height
    updatedChartOptions.scales.yAxes[0].ticks.max = max;


    setChartData(updatedChartData);
    setChartOptions(updatedChartOptions);
  }, [endYear, startYear]);

  return (
    <div id="chart">
      <Line data={chartData} height={400} options={chartOptions} />
    </div>
  );
};

export default PredictionChart;
