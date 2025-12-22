import React from 'react';

import { ChoiceInput } from '../../../../components/input-components';

import TogglesOverlay from '../../../../components/map/components';
import './style.scss';

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
            <div className="scatter-chart-bar-year-selection-title">Year</div>
            <div className="scatter-chart-bar-year-selection-options">
              <ChoiceInput setValue={setPredictionYear} options={revYears} value={year} />
            </div>
          </div>
          <div className="scatter-chart-bar-toggles-section">
            <TogglesOverlay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScatterChartSelectionBar;
