import React, { useState } from 'react';

import './style.scss';

import {
  TrappingDataMap,
  LineChart,
  OverviewText,
  SelectionBar,
} from './components';

const mapIcon = require('../../assets/icons/map.png');
const chartIcon = require('../../assets/icons/line-chart.png');

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
            src={mapIcon}
            alt="Map View"
            id={chartMode ? null : 'selected-view'}
            onClick={() => setChartMode(false)}
          />
          <br />
          <btn
            onClick={() => setChartMode(false)}
            id={chartMode ? null : 'selected-view'}
            className="view-selection-btn"
          >
            Map View
          </btn>
        </div>
        <div id="selection">
          <img
            src={chartIcon}
            alt="Chart View"
            id={chartMode ? 'selected-view' : null}
            onClick={() => setChartMode(true)}
          />
          <br />
          <btn
            onClick={() => setChartMode(true)}
            id={chartMode ? 'selected-view' : null}
            className="view-selection-btn"
          >
            Graph View
          </btn>
        </div>
      </div>
      <div>
        {chartMode ? <LineChart data={trappingData} /> : <TrappingDataMap />}
      </div>
      {/* <div>
          <LineChart data={trappingData} />
        </div>
        <div>
          <TrappingDataMap />
        </div> */}
      {/* <ReactTooltip /> */}
      {/* </div> */}
    </div>
  );
};

export default TrappingData;
