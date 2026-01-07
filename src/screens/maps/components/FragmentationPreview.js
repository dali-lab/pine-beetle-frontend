import React from 'react';

const FragmentationPreview = () => {
  return (
    <div className="map-preview">
      <div className="map-preview-content">
        <svg width="100%" height="100%" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet">
          {/* Simple map-like visualization */}
          <rect width="200" height="120" fill="#f0fdf4" />
          {/* Fragmented pattern */}
          <rect x="20" y="20" width="30" height="30" fill="#16a34a" opacity="0.4" />
          <rect x="60" y="30" width="25" height="25" fill="#16a34a" opacity="0.5" />
          <rect x="100" y="25" width="35" height="35" fill="#16a34a" opacity="0.3" />
          <rect x="30" y="60" width="20" height="20" fill="#16a34a" opacity="0.6" />
          <rect x="70" y="65" width="28" height="28" fill="#16a34a" opacity="0.4" />
          <rect x="110" y="70" width="30" height="30" fill="#16a34a" opacity="0.5" />
          <text x="100" y="60" textAnchor="middle" fontSize="8" fill="#16a34a" fontWeight="600">
            Fragmentation
          </text>
        </svg>
      </div>
    </div>
  );
};

export default FragmentationPreview;
