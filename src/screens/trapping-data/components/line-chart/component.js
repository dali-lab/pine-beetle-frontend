import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

import { getYearRange } from '../../../../constants';

import './style.scss';

const LineChart = (props) => {
  const {
    yearData = [],
    startYear,
    endYear,
  } = props;

  const [totalChartData, setTotalChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Total Spots',
        fill: false,
      },
    ],
  });

  const [spbChartData, setSpbChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        label: 'SPB Per 2 Weeks',
        fill: false,
      },
    ],
  });

  const [avgProbChartData, setAvgProbChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Clerid Per 2 Weeks',
        fill: false,
      },
    ],
  });

  const [totalChartOptions, setTotalChartOptions] = useState({
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
      display: false,
      position: 'top',
    },
  });

  const [spbChartOptions, setSpbChartOptions] = useState({
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

          return `${label}: ${value.toFixed(2)}`;
        },
      },
    },
    legend: {
      display: true,
      position: 'top',
    },
  });

  const [avgProbChartOptions, setAvgProbChartOptions] = useState({
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

          return `${label}: ${value.toFixed(2)}`;
        },
      },
    },
    legend: {
      display: true,
      position: 'top',
    },
  });

  useEffect(() => {
    const updatedTotalChartData = {
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
      ],
    };

    const updatedChartOptions = {
      ...totalChartOptions,
    };

    updatedTotalChartData.labels = getYearRange(startYear, endYear);

    // get sum of spots by year
    const spotMap = yearData.reduce((acc, { year, sumSpotst0 }) => ({
      ...acc,
      [year]: sumSpotst0,
    }), getYearRange(startYear, endYear).reduce((p, c) => ({ ...p, [c]: null }), {}));

    // update chartData
    updatedTotalChartData.datasets[0].data = Object.values(spotMap);

    // maximum value found in the array
    const max = Math.max(...[
      ...updatedTotalChartData.datasets[0].data,
    ]);

    // set new y-axis height
    updatedChartOptions.scales.yAxes[0].ticks.max = max;

    setTotalChartData(updatedTotalChartData);
    setTotalChartOptions(updatedChartOptions);
  }, [yearData]);

  useEffect(() => {
    const updatedSPBChartData = {
      labels: [],
      datasets: [
        {
          data: [],
          label: 'SPB Per 2 Weeks',
          borderColor: '#ff525c',
          backgroundColor: '#ff525c',
          fill: false,
          lineTension: 0,
          borderDash: [5, 1],
        },
      ],
    };

    const updatedChartOptions = {
      ...spbChartOptions,
    };

    updatedSPBChartData.labels = getYearRange(startYear, endYear);

    // get sum of spb by year
    const spbMap = yearData.reduce((acc, { year, sumSpbPer2Weeks }) => ({
      ...acc,
      [year]: sumSpbPer2Weeks,
    }), getYearRange(startYear, endYear).reduce((p, c) => ({ ...p, [c]: null }), {}));

    // update chartData
    updatedSPBChartData.datasets[0].data = Object.values(spbMap);

    // maximum value found in the array
    const max = Math.max(...[
      ...updatedSPBChartData.datasets[0].data,
    ]);

    // set new y-axis height
    updatedChartOptions.scales.yAxes[0].ticks.max = max;

    setSpbChartData(updatedSPBChartData);
    setSpbChartOptions(updatedChartOptions);
  }, [yearData]);

  useEffect(() => {
    const updatedAvgProbChartData = {
      labels: [],
      datasets: [
        {
          data: [],
          label: 'Clerid Per 2 Weeks',
          borderColor: '#ffc148',
          backgroundColor: '#ffc148',
          fill: false,
          lineTension: 0,
        },
      ],
    };

    const updatedChartOptions = {
      ...avgProbChartOptions,
    };

    updatedAvgProbChartData.labels = getYearRange(startYear, endYear);

    // get sum of clerids by year
    const avgProbMap = yearData.reduce((acc, { year, avgProbGreater50 }) => ({
      ...acc,
      [year]: avgProbGreater50,
    }), getYearRange(startYear, endYear).reduce((p, c) => ({ ...p, [c]: null }), {}));

    // update chartData
    updatedAvgProbChartData.datasets[0].data = Object.values(avgProbMap);

    // maximum value found in the array
    const max = Math.max(...[
      ...updatedAvgProbChartData.datasets[0].data,
    ]);

    // set new y-axis height
    updatedChartOptions.scales.yAxes[0].ticks.max = max;

    setAvgProbChartData(updatedAvgProbChartData);
    setAvgProbChartOptions(updatedChartOptions);
  }, [yearData]);

  return (
    <div>
      <div id="chart">
        <div>
          <h2 id="chart-title">SPB ⋅ trap<sup>-1</sup> ⋅ 14 days <sup>-1</sup></h2>
          <Line data={spbChartData} height={400} options={spbChartOptions} />
        </div>
        <div>
          <h2 id="chart-title">Total SPB Spots per year in selected areas</h2>
          <Line data={totalChartData} height={400} options={totalChartOptions} />
        </div>
        <div>
          <h2 id="chart-title">Predicted probability of &gt; 50 spots</h2>
          <Line data={avgProbChartData} height={400} options={avgProbChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default LineChart;
