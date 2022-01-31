import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

import { getYearRange } from './utils';

import './style.scss';

const LineChart = (props) => {
  const {
    data = [],
    startYear,
    endYear,
  } = props;

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Total Spots',
        fill: false,
      },
      {
        data: [],
        label: 'SPB Per 2 Weeks',
        fill: false,
      },
      {
        data: [],
        label: 'Clerids Per 2 Weeks',
        fill: false,
      },
    ],
  });

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
          label: 'Total Spots',
          borderColor: '#5383ff',
          backgroundColor: '#5383ff',
          fill: false,
          lineTension: 0,
          borderDash: [10, 5],
        },
        {
          data: [],
          label: 'SPB Per 2 Weeks',
          borderColor: '#ff525c',
          backgroundColor: '#ff525c',
          fill: false,
          lineTension: 0,
          borderDash: [5, 1],
        },
        {
          data: [],
          label: 'Clerids Per 2 Weeks',
          borderColor: '#ffc148',
          backgroundColor: '#ffc148',
          fill: false,
          lineTension: 0,
        },
      ],
    };

    const updatedChartOptions = {
      ...chartOptions,
    };

    // sort data array
    const sortedData = data.sort((a, b) => (a.year > b.year ? 1 : -1));

    updatedChartData.labels = getYearRange(startYear, endYear);

    // sum up spots by year
    const spotMap = sortedData.reduce((acc, curr) => ({
      ...acc,
      [curr.year]: curr.spotst0 ? curr.spotst0 + acc[curr.year] : acc[curr.year],
    }), getYearRange(startYear, endYear).reduce((p, c) => ({ ...p, [c]: null }), {}));

    // sum up spb by year
    const spbMap = sortedData.reduce((acc, curr) => ({
      ...acc,
      [curr.year]: curr.spbPer2Weeks ? curr.spbPer2Weeks + acc[curr.year] : acc[curr.year],
    }), getYearRange(startYear, endYear).reduce((p, c) => ({ ...p, [c]: null }), {}));

    // sum up clerids by year
    const cleridMap = sortedData.reduce((acc, curr) => ({
      ...acc,
      [curr.year]: curr.cleridsPer2Weeks ? curr.cleridsPer2Weeks + acc[curr.year] : acc[curr.year],
    }), getYearRange(startYear, endYear).reduce((p, c) => ({ ...p, [c]: null }), {}));

    // update chartData
    updatedChartData.datasets[0].data = Object.values(spotMap);
    updatedChartData.datasets[1].data = Object.values(spbMap);
    updatedChartData.datasets[2].data = Object.values(cleridMap);

    // maximum value found in the array
    const max = Math.max(...[
      ...updatedChartData.datasets[0].data,
      ...updatedChartData.datasets[1].data,
      ...updatedChartData.datasets[2].data,
    ]);

    // set new y-axis height
    updatedChartOptions.scales.yAxes[0].ticks.max = max;

    setChartData(updatedChartData);
    setChartOptions(updatedChartOptions);
  }, [data]);

  return (
    <div id="chart">
      <Line data={chartData} height={400} options={chartOptions} />
    </div>
  );
};

export default LineChart;
