import React from 'react';
import winterImage from '../../../assets/images/winter.png';

const MinWinterTempPreview = () => {
  return (
    <div className="map-preview">
      <div className="map-preview-content">
        <img
          src={winterImage}
          alt="Minimum Winter Temperature Map Preview"
          className="map-preview-image"
        />
      </div>
    </div>
  );
};

export default MinWinterTempPreview;
