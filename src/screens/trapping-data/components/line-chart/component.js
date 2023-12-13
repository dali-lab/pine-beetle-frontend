import React from 'react';
import { AvgProbChart, SPBChart, TotalChart } from './components';

import './style.scss';

const LineChart = () => {
  return (
    <div>
      <div id="chart">
        <div>
          <h2 id="chart-title">SPB ⋅ trap<sup>-1</sup> ⋅ 14 days<sup>-1</sup></h2>
          <SPBChart />
        </div>
        <div>
          <h2 id="chart-title">Total SPB Spots per year in selected areas</h2>
          <TotalChart />
        </div>
        <div>
          <h2 id="chart-title">Predicted probability of &gt; 50 spots</h2>
          <AvgProbChart />
        </div>
      </div>
    </div>
  );
};

export default LineChart;
