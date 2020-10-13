import React from 'react';
import ReactTooltip from 'react-tooltip';

import './style.scss';

import {
  HistoricalDataMap,
  LineChart,
  SelectionBar,
} from './components';

const HistoricalData = (props) => {
  const {
    trappingData,
  } = props;

  return (
    <div>
      <div>
        <SelectionBar />
        <p>{JSON.stringify(trappingData)}</p>
        <div>
          <LineChart data={[]} /* firstObservedYear={} lastObservedYear={} */ />
        </div>
        <div>
          <HistoricalDataMap /* summarizedDataByLatLong={} */ />
        </div>
        <ReactTooltip />
      </div>
    </div>
  );
};

export default HistoricalData;
