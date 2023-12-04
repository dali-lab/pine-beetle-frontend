import React from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../../../constants';
import { Button } from '../../../../components';

const HistoricalData = () => {
  const history = useHistory();

  return (
    <div className="page-container">
      <div className="home-content-section-title">Historical Data</div>
      <div id="summary">
        Trapping data collected since 1988 were used to build the prediction model on this website. View and download the data here. Data can be filtered by years and/or locations.
      </div>
      <Button onClick={() => history.push(ROUTES.TRAPPING_DATA)} buttonStyle="secondary">View trapping data</Button>
    </div>
  );
};

export default HistoricalData;
