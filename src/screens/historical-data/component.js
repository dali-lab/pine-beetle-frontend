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
    isLoading,
    trappingData,
    trappingErrorText,
  } = props;

  return (
    <div>
      {/* TODO: make this a spinner */}
      {isLoading && <p>Loading...</p>}
      {trappingErrorText.length > 0 && trappingErrorText.map(t => <p>{t}</p>)}
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
