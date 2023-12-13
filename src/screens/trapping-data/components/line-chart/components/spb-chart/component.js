import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import { ROUTES, getYearRange } from '../../../../../../constants';

const SPBChart = (props) => {
  const {
    yearData = [], startYear, endYear,
  } = props;

  const location = useLocation();
  const isHomepage = location.pathname === ROUTES.HOME;

  const [spbChartData, setSpbChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        fill: false,
      },
    ],
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
          fontSize: isHomepage ? '14' : '22',
          padding: isHomepage ? '1' : '8',
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
          fontSize: isHomepage ? '14' : '22',
          padding: isHomepage ? '2' : '8',
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
    },
  });

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

  return <Line data={spbChartData} height={400} options={spbChartOptions} />;
};

export default SPBChart;
