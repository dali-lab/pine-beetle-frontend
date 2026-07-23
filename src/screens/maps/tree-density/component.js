import React from 'react';
import './style.scss';

// Placeholder URL - to be updated with actual ArcGIS Online embed URL
const IFRAME_URL = '';

const TreeDensityMap = () => {
  return (
    <div className="map-page">
      <div className="map-container">
        <div className="page-header">
          <h1>Tree Density</h1>
        </div>
        <div className="iframe-container">
          <iframe
            src={IFRAME_URL}
            title="Tree Density Map"
            allowFullScreen
            className="map-iframe"
          />
        </div>
      </div>
    </div>
  );
};

export default TreeDensityMap;
