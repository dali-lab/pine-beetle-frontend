import React from 'react';
import ReactECharts from 'echarts-for-react';
import './style.scss';

const SingleChart = ({
  withBorder,
  frequency,
  data,
}) => {
  // Guard: ensure data is valid
  if (!data || !Array.isArray(data)) {
    return (
      <div className={`single-chart-wrapper ${withBorder && 'with-border'}`}>
        <div
          style={{
            height: 250,
            width: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p>No data available</p>
        </div>
        <p className="single-chart__text">
          Frequency (n&nbsp;=&nbsp;{frequency || 0})
        </p>
      </div>
    );
  }

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
        lineStyle: { color: '#000', width: 1 },
        onZero: false,
      },
      axisTick: {
        show: true,
        alignWithLabel: true,
        lineStyle: { color: '#000', width: 1 },
        length: 10,
      },
      axisLabel: {
        show: false,
      },
      boundaryGap: true,
      offset: 1,
    },
    xAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: { color: '#000', width: 1 },
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
        lineStyle: { color: '#000', width: 1 },
      },
      max: Number.isFinite(frequency) && frequency > 0 ? frequency : undefined,
    },
    series: [
      {
        name: 'Frequency',
        type: 'bar',
        data: Array.isArray(data) ? data.filter((item) => item != null && !Number.isNaN(item)) : [],
        barWidth: '98%',
        barCategoryGap: '1%',
        itemStyle: {
          color: (params) => {
            if (!params || !params.name) {
              return '#86CCFF';
            }
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
      <p className="single-chart__text">
        Frequency (n&nbsp;=&nbsp;{frequency})
      </p>
    </div>
  );
};

export default SingleChart;
