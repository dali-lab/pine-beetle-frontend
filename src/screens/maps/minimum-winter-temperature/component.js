import React from 'react';
import './style.scss';

// Placeholder URL - to be updated with actual ArcGIS Online embed URL
const IFRAME_URL = '';

const MinWinterTempMap = () => {
  return (
    <div className="map-page">
      <div className="map-container">
        <div className="page-header">
          <h1>Minimum Winter Temperature</h1>
        </div>
        <div className="iframe-container">
          <iframe
            src={IFRAME_URL}
            title="Minimum Winter Temperature Map"
            allowFullScreen
            className="map-iframe"
          />
        </div>
      </div>
    </div>
  );
};

export default MinWinterTempMap;
