import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getYearRange } from '../../../../../../constants';

const TotalChart = (props) => {
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

          return `${label}: ${value}`;
        },
      },
    },
    legend: {
      display: true,
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

  return <Line data={totalChartData} height={400} options={totalChartOptions} />;
};

export default TotalChart;
