import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getYearRange } from '../../../../../constants';

const AvgProbChart = (props) => {
  const {
    yearData = [],
    startYear,
    endYear,
  } = props;

  const [avgProbChartData, setAvgProbChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        fill: false,
      },
    ],
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
          labelString: 'Percent Probability',
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
    },
  });

  useEffect(() => {
    const updatedAvgProbChartData = {
      labels: [],
      datasets: [
        {
          data: [],
          label: 'Average Probability > 50%',
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

    const avgProbMap = yearData.reduce((acc, { year, avgProbGreater50 }) => ({
      ...acc,
      [year]: avgProbGreater50,
    }), getYearRange(startYear, endYear).reduce((p, c) => ({ ...p, [c]: null }), {}));

    updatedAvgProbChartData.datasets[0].data = Object.values(avgProbMap);

    const max = Math.max(...[
      ...updatedAvgProbChartData.datasets[0].data,
    ]);

    updatedChartOptions.scales.yAxes[0].ticks.max = max;

    setAvgProbChartData(updatedAvgProbChartData);
    setAvgProbChartOptions(updatedChartOptions);
  }, [yearData, startYear, endYear]);

  return <Line data={avgProbChartData} height={400} options={avgProbChartOptions} />;
};

export default AvgProbChart;
