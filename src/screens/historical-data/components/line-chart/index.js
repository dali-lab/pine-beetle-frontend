import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

import { getYearRange } from './utils';

import './style.scss';

const LineChart = (props) => {
  const {
    data = [],
  } = props;

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Total Spots',
        borderColor: '#1f77b4',
        backgroundColor: 'rgba(31, 119, 180, 0.5)',
        fill: false,
      },
      {
        data: [],
        label: 'Total SPB',
        borderColor: '#ff7f0e',
        backgroundColor: 'rgba(255, 127, 14, 0.5)',
        fill: false,
      },
      {
        data: [],
        label: 'Total Clerids',
        borderColor: '#2ca02c',
        backgroundColor: 'rgba(44, 160, 44, 0.5)',
        fill: false,
      },
    ],
  });

  const [chartOptions, setChartOptions] = useState({
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          max: 1000,
          min: 0,
        },
      }],
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
  });

  useEffect(() => {
    const updatedChartData = {
      labels: [],
      datasets: [
        {
          data: [],
          label: 'Total Spots',
          borderColor: '#1f77b4',
          fill: false,
        },
        {
          data: [],
          label: 'Total SPB Per Two Weeks',
          borderColor: '#ff7f0e',
          fill: false,
        },
        {
          data: [],
          label: 'Total Clerids Per Two Weeks',
          borderColor: '#2ca02c',
          fill: false,
        },
      ],
    };

    const updatedChartOptions = {
      ...chartOptions,
    };

    // sort data array
    const sortedData = data.sort((a, b) => (a.year > b.year ? 1 : -1));

    // initialize start and end date
    const startDate = sortedData.reduce((p, c) => (p.year < c.year ? p : c), {})?.year || 2011;
    const endDate = sortedData.reduce((p, c) => (p.year > c.year ? p : c), {})?.year || new Date().getFullYear();

    updatedChartData.labels = getYearRange(startDate, endDate);

    // sum up spots by year
    const spotMap = sortedData.reduce((acc, curr) => ({
      ...acc,
      [curr.year]: curr.spots + acc[curr.year],
    }), getYearRange(startDate, endDate).reduce((p, c) => ({ ...p, [c]: 0 }), {}));

    // sum up spb by year
    const spbMap = sortedData.reduce((acc, curr) => ({
      ...acc,
      [curr.year]: curr.spbCount + acc[curr.year],
    }), getYearRange(startDate, endDate).reduce((p, c) => ({ ...p, [c]: 0 }), {}));

    // sum up clerids by year
    const cleridMap = sortedData.reduce((acc, curr) => ({
      ...acc,
      [curr.year]: curr.cleridCount + acc[curr.year],
    }), getYearRange(startDate, endDate).reduce((p, c) => ({ ...p, [c]: 0 }), {}));

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
    <Line data={chartData} height={400} options={chartOptions} />
  );
};

export default LineChart;
