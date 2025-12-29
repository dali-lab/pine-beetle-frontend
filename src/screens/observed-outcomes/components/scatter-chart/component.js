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
  data, isLoading, predictionYear, dataMode, selectedState, county, rangerDistrict,
}) => {
  const chartRef = useRef(null);

  const formattedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
    return data
      .filter((item) => {
        // Filter out invalid data points
        return item
          && typeof item.probSpotsGT50 === 'number'
          && !Number.isNaN(item.probSpotsGT50)
          && typeof item.lnSpots === 'number'
          && !Number.isNaN(item.lnSpots)
          && item.year
          && item.state;
      })
      .map((item) => {
        let locationName = '';
        if (item.county) {
          locationName = item.county;
        } else if (item.rangerDistrict) {
          const rdFormat = getMapboxRDNameFormat(item.rangerDistrict);
          locationName = rdFormat ? `${rdFormat.slice(0, -3)} Ranger District` : 'Unknown Ranger District';
        } else {
          locationName = 'Unknown Location';
        }
        return [
          item.probSpotsGT50 * 100,
          item.lnSpots,
          `${locationName}, ${item.state}`,
          item.year,
          item.spotst0 || 0,
        ];
      });
  }, [data]);

  const selectedYearData = useMemo(
    () => formattedData.filter((d) => d[3] === predictionYear),
    [formattedData, predictionYear]
  );

  useEffect(() => {
    // Guard: ensure chartRef is available and data is ready
    if (!chartRef.current) {
      return undefined;
    }

    // Guard: ensure we have valid data before initializing
    if (!formattedData || formattedData.length === 0) {
      return undefined;
    }

    // Guard: ensure DOM element is actually in the DOM
    if (!chartRef.current.offsetParent && chartRef.current.offsetWidth === 0) {
      return undefined;
    }

    let chart;
    try {
      chart = echarts.init(chartRef.current);
    } catch (error) {
      console.error('Error initializing ECharts:', error);
      return undefined;
    }

    // Guard: ensure chart was initialized successfully
    if (!chart || chart.isDisposed()) {
      return undefined;
    }

    // Ensure all datasets have valid data
    const allData = (formattedData && Array.isArray(formattedData) && formattedData.length > 0) ? formattedData : [];
    const selectedData = (selectedYearData && Array.isArray(selectedYearData) && selectedYearData.length > 0) ? selectedYearData : [];
    const regressionData = getCustomRegressionLine();

    // Ensure regressionData is valid
    if (!regressionData || !Array.isArray(regressionData) || regressionData.length === 0) {
      return undefined;
    }

    // Don't render if we have no data at all
    if (allData.length === 0 && selectedData.length === 0) {
      return undefined;
    }

    const option = {
      dataset: [
        { id: 'all', source: allData.length > 0 ? allData : [] },
        { id: 'selected', source: selectedData.length > 0 ? selectedData : [] },
        { id: 'manualRegression', source: regressionData },
      ],
      title: {
        text: `Year ${predictionYear} highlighted`,
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if (!params || !params.data || !Array.isArray(params.data)) {
            return '';
          }
          const [x, y, location, year, spotst0] = params.data;
          if (typeof x !== 'number' || typeof y !== 'number' || Number.isNaN(x) || Number.isNaN(y)) {
            return '';
          }
          return `${location || 'Unknown'} (${year || 'N/A'})<br/><br/>spots = exp(${y.toFixed(2)}) - 1 = ${spotst0 || 0}<br/>Percent chance > 50 spots: <b>${x.toFixed(0)}%</b>`;
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
        ...(allData.length > 0 ? [{
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
        }] : []),
        ...(selectedData.length > 0 ? [{
          name: `Year ${predictionYear}`,
          type: 'scatter',
          datasetId: 'selected',
          encode: { x: 0, y: 1 },
          itemStyle: { color: '#cc0002' },
          symbolSize: 10,
        }] : []),
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

    try {
      chart.setOption(option);
    } catch (error) {
      console.error('Error setting ECharts option:', error);
      if (chart && !chart.isDisposed()) {
        chart.dispose();
      }
      return undefined;
    }

    const handleResize = () => {
      if (chart && !chart.isDisposed()) {
        try {
          chart.resize();
        } catch (error) {
          console.error('Error resizing chart:', error);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (chart && !chart.isDisposed()) {
        chart.dispose();
      }
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
