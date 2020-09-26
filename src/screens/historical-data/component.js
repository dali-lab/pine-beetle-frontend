import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';

import './style.scss';

import {
  HistoricalDataMap,
  LineChart,
  SelectionBar,
} from './components';

const initialStatisticsData = {
  SPOTS: 0,
  SPB: 0,
  CLERIDS: 0,
};

const HistoricalData = (_props) => {
  const [means] = useState(initialStatisticsData);
  const [standardDeviations] = useState(initialStatisticsData);

  return (
    <div>
      <div>
        <SelectionBar />
        <div className="flex-container" id="map-area-container">
          <div className="flex-item container" id="line-container">
            <LineChart data={[]} /* firstObservedYear={} lastObservedYear={} */ />
          </div>
          <div id="mapbox-container">
            <HistoricalDataMap /* summarizedDataByLatLong={} */ />
          </div>
        </div>
        <div className="container" id="line-metrics-area">
          <table>
            <tr>
              <th>
                <p data-tip="Sample Mean of Spots"><b>Spots Mean: </b>{means.SPOTS.toFixed(1)}</p>
                <p data-tip="Standard Deviation of Spots"><b>Spots SD: </b>{standardDeviations.SPOTS.toFixed(1)}</p>
              </th>
              <th>
                <p data-tip="Sample Mean of SPB"><b>SPB Mean: </b>{means.SPB.toFixed(1)}</p>
                <p data-tip="Standard Deviation of SPB"><b>SPB SD: </b>{standardDeviations.SPB.toFixed(1)}</p>
              </th>
              <th>
                <p data-tip="Sample Mean of Clerids"><b>Clerids Mean: </b>{means.CLERIDS.toFixed(1)}</p>
                <p data-tip="Standard Deviation of Clerids"><b>Clerids SD: </b>{standardDeviations.CLERIDS.toFixed(1)}</p>
              </th>
            </tr>
          </table>
          <ReactTooltip />
        </div>
      </div>
    </div>
  );
};

export default HistoricalData;
