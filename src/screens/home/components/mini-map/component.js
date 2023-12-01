import React from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../../../constants';
import { PredictionMap } from '../../../prediction/components';
import { Button } from '../../../../components';

import './style.scss';

const MiniMap = () => {
  const history = useHistory();
  return (
    <div className="page-container mini-map">
      <div className="home-content-section-title">Predictions</div>

      <PredictionMap />
      <Button onClick={() => history.push(ROUTES.PREDICTIONS)} className="animated-button">
        View predictions
      </Button>
    </div>
  );
};

export default MiniMap;
