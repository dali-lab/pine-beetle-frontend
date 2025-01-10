import React from 'react';
import ReactECharts from 'echarts-for-react';
import './style.scss';

const SingleChart = ({ withBorder }) => {
  const options = {
    grid: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
      containLabel: false,
    },
    yAxis: {
      type: 'category',
      data: ['0', '1-9', '10-19', '20-49', '50-99', '100-249', '>249'],
      axisLine: {
        show: true,
        lineStyle: { color: '#000', width: 2 },
      },
      axisTick: {
        show: true,
        alignWithLabel: true,
        lineStyle: { color: '#000', width: 1.5 },
        length: 10,
      },
      axisLabel: {
        show: false,
      },
      boundaryGap: true,
    },
    xAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: { color: '#000', width: 1.3 },
      },
      axisTick: {
        show: true,
        length: 5, // Big ticks
        inside: false,
        lineStyle: { color: '#000', width: 1 },
      },
      splitLine: { show: false },
      axisLabel: { show: false },
      minorTick: {
        show: true,
        splitNumber: 4, // 3 smaller ticks between big ticks
        length: 3,
        lineStyle: { color: '#000', width: 0.5 },
      },
    },
    series: [
      {
        name: 'Spots',
        type: 'bar',
        data: [200, 50, 80, 100, 200, 250, 300],
        barWidth: '98%',
        barCategoryGap: '1%',
        itemStyle: {
          color: (params) => {
            const categoriesAbove50 = ['>249', '100-249', '50-99'];
            return categoriesAbove50.includes(params.name)
              ? '#FFC148'
              : '#86CCFF';
          },
          borderRadius: [0, 5, 5, 0],
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
  };

  return (
    <div className={`single-chart-wrapper ${withBorder && 'with-border'}`}>
      <ReactECharts option={options} style={{ height: 250, width: 'auto' }} />
      <p className="single-chart__text">Frequency (n&nbsp;=&nbsp;1517)</p>
    </div>
  );
};

export default SingleChart;
