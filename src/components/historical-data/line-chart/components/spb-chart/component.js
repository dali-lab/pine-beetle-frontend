import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import { ROUTES, getYearRange } from '../../../../../constants';

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
          labelString: 'Average count',
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

          return `${label}: ${value}`;
        },
      },
    },
    legend: {
      display: true,
    },
  });

  useEffect(() => {
    if (!startYear || !endYear || startYear > endYear) {
      return;
    }

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

    const yearRange = getYearRange(startYear, endYear);
    if (yearRange.length === 0) {
      return;
    }

    updatedSPBChartData.labels = yearRange;

    const spbMap = yearData.reduce((acc, {
      year, avgSpbPerTrapPer2Weeks,
    }) => ({
      ...acc,
      [year]: avgSpbPerTrapPer2Weeks,
    }), yearRange.reduce((p, c) => ({ ...p, [c]: null }), {}));

    updatedSPBChartData.datasets[0].data = Object.values(spbMap);

    const maxValue = Math.max(
      ...updatedSPBChartData.datasets[0].data.filter((v) => v !== null && v !== undefined)
    );
    if (!Number.isNaN(maxValue) && maxValue > 0) {
      updatedChartOptions.scales.yAxes[0].ticks.max = maxValue;
    }

    setSpbChartData(updatedSPBChartData);
    setSpbChartOptions(updatedChartOptions);
  }, [yearData, startYear, endYear]);

  return <Line data={spbChartData} height={400} options={spbChartOptions} />;
};

export default SPBChart;
