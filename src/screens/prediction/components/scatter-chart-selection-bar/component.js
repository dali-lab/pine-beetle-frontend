import React from 'react';

import { ChoiceInput } from '../../../../components/input-components';

import './style.scss';
import TogglesOverlay from '../../../../components/map/components';

const ScatterChartSelectionBar = (props) => {
  const {
    availableYears,
    setPredictionYear,
    year,
  } = props;

  const revYears = [...availableYears].reverse();

  return (
    <div className="container">
      <div id="scatter-chart-bar">
        <div className="scatter-chart-bar-selections">
          <div className="scatter-chart-bar-year-selection">
            <p className="scatter-chart-bar-year-selection-title">Year</p>
            <div className="scatter-chart-bar-year-selection-options input-container">
              <ChoiceInput setValue={setPredictionYear} options={revYears} value={year} />
            </div>
          </div>
          <TogglesOverlay />
        </div>
      </div>
    </div>
  );
};

export default ScatterChartSelectionBar;
