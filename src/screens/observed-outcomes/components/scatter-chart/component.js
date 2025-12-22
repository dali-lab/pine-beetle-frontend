import * as echarts from 'echarts';
import * as ecStat from 'echarts-stat';
import React, { useEffect, useMemo, useRef } from 'react';

import {
  getMapboxRDNameFormat,
} from '../../../../utils';

import './style.scss';

echarts.registerTransform(ecStat.transform.regression);

const getCustomRegressionLine = () => {
  const points = [];
  for (let x = 0; x <= 100; x += 1) {
    const y = 0.1807 + 0.0673 * x;
    points.push([x, y]);
  }
  return points;
};

const ScatterChart = ({
  data, predictionYear, getChartData, dataMode, selectedState, county, rangerDistrict,
}) => {
  // Fetch data on mount and when filters change
  useEffect(() => {
    getChartData();
  }, [dataMode, selectedState, county, rangerDistrict, getChartData]);

  const chartRef = useRef(null);

  const formattedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
    return data.map((item) => [
      item.probSpotsGT50 * 100,
      item.lnSpots,
      `${item.county || `${getMapboxRDNameFormat(item.rangerDistrict).slice(0, -3)} Ranger District`}, ${item.state}`,
      item.year,
      item.spotst0,
    ]);
  }, [data]);

  const selectedYearData = useMemo(
    () => formattedData.filter((d) => d[3] === predictionYear),
    [formattedData, predictionYear]
  );

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option = {
      dataset: [
        { id: 'all', source: formattedData },
        { id: 'selected', source: selectedYearData },
        { id: 'manualRegression', source: getCustomRegressionLine() },
      ],
      title: {
        text: `Year ${predictionYear} highlighted`,
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const [x, y, location, year, spotst0] = params.data;
          return `${location} (${year})<br/><br/>spots = exp(${y.toFixed(2)}) - 1 = ${spotst0}<br/>Percent chance > 50 spots: <b>${x.toFixed(0)}%</b>`;
        },
        extraCssText: 'text-align: left;',
      },
      xAxis: {
        name: 'Predicted % chance of > 50 SPB spots',
        splitLine: { lineStyle: { type: 'dashed' } },
        axisLine: {
          onZero: false,
        },
        offset: 10,
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontSize: 16,
        },
      },
      yAxis: {
        name: 'Number of SPB infestations\nln(spots+1)',
        splitLine: { lineStyle: { type: 'dashed' } },
        axisLine: {
          onZero: false,
        },
        offset: 10,
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontSize: 16,
        },
      },
      series: [
        {
          name: 'All Years',
          type: 'scatter',
          datasetId: 'all',
          encode: { x: 0, y: 1 },
          itemStyle: {
            color: 'rgba(200, 200, 200, 0.5)',
            borderColor: 'rgba(200, 200, 200, 0.6)',
            borderWidth: 1,
          },
          symbolSize: 6,
          tooltip: { show: false },
          emphasis: {
            disabled: true,
          },
        },
        {
          name: `Year ${predictionYear}`,
          type: 'scatter',
          datasetId: 'selected',
          encode: { x: 0, y: 1 },
          itemStyle: { color: '#cc0002' },
          symbolSize: 10,
        },
        {
          name: 'Manual Regression',
          type: 'line',
          datasetId: 'manualRegression',
          encode: { x: 0, y: 1 },
          symbol: 'none',
          lineStyle: { color: 'blue', width: 2 },
          label: {
            show: true,
            position: 'end',
            fontSize: 14,
            formatter: () => 'y = 0.1807 + 0.0673 × P(> 50 spots)',
          },
        },
      ],
      graphic: {
        elements: [
          {
            type: 'text',
            left: 'center',
            top: 70,
            z: 10,
            style: {
              text: 'y = 0.1807 + 0.0673 × P(> 50 spots)',
              fontSize: 16,
              fill: '#333',
            },
          },
        ],
      },
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [formattedData, selectedYearData, predictionYear]);

  return (
    <div className="container scatter-chart">
      <div ref={chartRef} style={{ width: '100%', height: '600px' }} />
    </div>
  );
};

export default ScatterChart;
