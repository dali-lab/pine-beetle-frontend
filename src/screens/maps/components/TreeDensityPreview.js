import React from 'react';
import forestImage from '../../../assets/images/forest.png';

const TreeDensityPreview = () => {
  return (
    <div className="map-preview">
      <div className="map-preview-content">
        <img
          src={forestImage}
          alt="Tree Density Map Preview"
          className="map-preview-image"
        />
      </div>
    </div>
  );
};

export default TreeDensityPreview;
