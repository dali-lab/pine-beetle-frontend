import React from 'react';
import { PredictionMap, SelectionBar } from '../../../prediction/components';
import './style.scss';

const MapWithControls = () => {
  return (
    <div className="map-with-controls-wrapper">
      <div className="map-controls-overlay">
        <SelectionBar />
      </div>
      <PredictionMap />
    </div>
  );
};

export default MapWithControls;
