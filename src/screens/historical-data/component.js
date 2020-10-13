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
        <div>
          <LineChart data={trappingData} />
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
