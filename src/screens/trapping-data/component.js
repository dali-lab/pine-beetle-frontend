import React, { useState } from 'react';

import './style.scss';

import {
  TrappingDataMap,
  LineChart,
  OverviewText,
  SelectionBar,
} from './components';

const mapSelectedIcon = require('../../assets/icons/map-selected.png');
const mapUnselectedIcon = require('../../assets/icons/map-unselected.png');
const graphSelectedIcon = require('../../assets/icons/graph-selected.png');
const graphUnselectedIcon = require('../../assets/icons/graph-unselected.png');

const TrappingData = (props) => {
  const {
    isLoading,
    trappingData,
    trappingErrorText,
  } = props;

  const [chartMode, setChartMode] = useState(true);

  return (
    <div>
      {/* TODO: make this a spinner */}
      {isLoading && <p>Loading...</p>}
      {trappingErrorText.length > 0 && trappingErrorText.map(t => <p>{t}</p>)}
      <OverviewText />
      <SelectionBar />
      <div id="view-selections">
        <div id="selection" onClick={() => setChartMode(true)}>
          <img
            src={chartMode ? graphSelectedIcon : graphUnselectedIcon}
            alt="Chart View"
            id={chartMode ? 'selected-view' : null}
          />
          <p id={chartMode ? 'selected-view' : null} className="view-selection-btn">
            Graph View
          </p>
        </div>
        <div id="selection" onClick={() => setChartMode(false)}>
          <img
            src={chartMode ? mapUnselectedIcon : mapSelectedIcon}
            alt="Map View"
            id={chartMode ? null : 'selected-view'}
          />
          <p id={chartMode ? null : 'selected-view'} className="view-selection-btn">
            Map View
          </p>
        </div>
      </div>
      <div>
        {chartMode ? <LineChart data={trappingData} /> : <TrappingDataMap />}
      </div>
    </div>
  );
};

export default TrappingData;
