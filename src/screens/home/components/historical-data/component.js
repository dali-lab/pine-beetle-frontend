import React from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../../../constants';
import { Button } from '../../../../components';
import { SPBChart } from '../../../trapping-data/components/line-chart/components';

import './style.scss';

const HistoricalData = () => {
  const history = useHistory();

  return (
    <div className="page-container home-content-historical-data">
      <div className="home-content-section-title">Historical Data</div>
      <SPBChart screen="home" />
      <Button onClick={() => history.push(ROUTES.TRAPPING_DATA)} buttonStyle="secondary">View trapping data</Button>
    </div>
  );
};

export default HistoricalData;
