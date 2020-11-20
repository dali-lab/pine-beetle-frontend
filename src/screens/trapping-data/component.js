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
      {/* <div> */}
      <OverviewText />
      <SelectionBar />
      <div className="container" id="view-selections">
        <div id="selection">
          <img
            src={chartMode ? mapUnselectedIcon : mapSelectedIcon}
            alt="Map View"
            id={chartMode ? null : 'selected-view'}
            onClick={() => setChartMode(false)}
          />
          <br />
          <button
            onClick={() => setChartMode(false)}
            id={chartMode ? null : 'selected-view'}
            className="view-selection-btn"
            type="button"
          >
            Map View
          </button>
        </div>
        <div id="selection">
          <img
            src={chartMode ? graphSelectedIcon : graphUnselectedIcon}
            alt="Chart View"
            id={chartMode ? 'selected-view' : null}
            onClick={() => setChartMode(true)}
          />
          <br />
          <button
            onClick={() => setChartMode(true)}
            id={chartMode ? 'selected-view' : null}
            className="view-selection-btn"
            type="button"
          >
            Graph View
          </button>
        </div>
      </div>
      <div>
        {chartMode ? <LineChart data={trappingData} /> : <TrappingDataMap />}
      </div>
    </div>
  );
};

export default TrappingData;
