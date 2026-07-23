import React from 'react';
import fragmentationImage from '../../../assets/images/fragmentation.png';

const FragmentationPreview = () => {
  return (
    <div className="map-preview">
      <div className="map-preview-content">
        <img
          src={fragmentationImage}
          alt="Fragmentation Map Preview"
          className="map-preview-image"
        />
      </div>
    </div>
  );
};

export default FragmentationPreview;
