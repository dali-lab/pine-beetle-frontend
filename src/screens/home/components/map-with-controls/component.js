import React from 'react';
import { PredictionMap } from '../../../prediction/components';
import './style.scss';

const MapWithControls = () => {
  return (
    <div className="map-with-controls-wrapper">
      <PredictionMap />
    </div>
  );
};

export default MapWithControls;
