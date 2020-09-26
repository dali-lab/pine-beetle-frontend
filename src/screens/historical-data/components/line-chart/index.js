import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

import './style.scss';

const LineChart = (props) => {
  const {
    data = [],
    firstObservedYear = 1987,
    lastObservedYear = new Date().getFullYear(),
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
        label: 'Total SPB Per Two Weeks',
        borderColor: '#ff7f0e',
        backgroundColor: 'rgba(255, 127, 14, 0.5)',
        fill: false,
      },
      {
        data: [],
        label: 'Total Clerids Per Two Weeks',
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

    // initialize data arrays
    const spots = [];
    const spb = [];
    const clerids = [];

    // initialize start and end date
    const startDate = firstObservedYear;
    const endDate = lastObservedYear;

    let yearNum;

    // initialize sum for each year
    for (yearNum = 0; yearNum <= (parseInt(endDate, 10) - parseInt(startDate, 10)); yearNum += 1) {
      spots[yearNum] = 0;
      spb[yearNum] = 0;
      clerids[yearNum] = 0;
    }

    // add data and labels to object
    data.forEach((dataPoint) => {
      const { year } = dataPoint;
      yearNum = year - startDate;

      // update spots count
      if (dataPoint.spots != null) {
        spots[yearNum] += dataPoint.spots;
      }

      // update spb per two weeks count
      if (dataPoint.spbPerTwoWeeks != null) {
        spb[yearNum] += dataPoint.spbPerTwoWeeks;
      }

      // update clerids per two weeks count
      if (dataPoint.cleridsPerTwoWeeks != null) {
        clerids[yearNum] += dataPoint.cleridsPerTwoWeeks;
      }

      // add to the line chart's label if we haven't yet found this day
      if (!updatedChartData.labels.includes(year)) {
        updatedChartData.labels.push(year);
      }
    });

    // update chartData
    updatedChartData.datasets[0].data = spots;
    updatedChartData.datasets[1].data = spb;
    updatedChartData.datasets[2].data = clerids;

    // maximum value found in the array
    const max = Math.max([
      ...updatedChartData.datasets[0].data,
      ...updatedChartData.datasets[1].data,
      ...updatedChartData.datasets[2].data,
    ]);

    // set new y-axis height
    updatedChartOptions.scales.yAxes[0].ticks.max = max;

    // filter out any missing/undefined values
    updatedChartData.datasets[0].data = updatedChartData.datasets[0].data.filter(item => !!item);
    updatedChartData.datasets[1].data = updatedChartData.datasets[1].data.filter(item => !!item);
    updatedChartData.datasets[2].data = updatedChartData.datasets[2].data.filter(item => !!item);

    setChartData(updatedChartData);
    setChartOptions(updatedChartOptions);
  }, [data, firstObservedYear, lastObservedYear]);

  return (
    <Line data={chartData} height={400} options={chartOptions} />
  );
};

export default LineChart;
