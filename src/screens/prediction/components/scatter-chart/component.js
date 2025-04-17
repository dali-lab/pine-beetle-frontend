import React, { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import * as ecStat from 'echarts-stat';

echarts.registerTransform(ecStat.transform.regression);

const getCustomRegressionLine = () => {
  const points = [];
  for (let x = 0; x <= 100; x += 1) {
    const y = 0.1807 + 0.0673 * x;
    points.push([x, y]);
  }
  return points;
};

const ScatterChart = ({ data }) => {
  const chartRef = useRef(null);

  const selectedYear = 2018;
  const formattedData = useMemo(() => {
    return data.map((item) => [
      item.probSpotsGT50 * 100,
      item.lnSpots,
      `${item.county}, ${item.state}`,
      item.year,
    ]);
  }, [data]);

  const selectedYearData = useMemo(
    () => formattedData.filter((d) => d[3] === selectedYear),
    [formattedData, selectedYear],
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
        text: 'Probability vs Log Predicted Units',
        subtext: `Year ${selectedYear} highlighted`,
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const [x, y, location, year] = params.data;
          return `${location} (${year})<br/><br/>ln(Spots): <b>${y.toFixed(2)}</b><br/>Percent chance > 50 spots: <b>${x.toFixed(0)}%</b>`;
        },
      },
      xAxis: {
        name: 'Percent chance > 50 spots',
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
        name: 'ln(Spots)',
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
          name: `Year ${selectedYear}`,
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

    return () => chart.dispose();
  }, [formattedData]);

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />;
};

export default ScatterChart;
