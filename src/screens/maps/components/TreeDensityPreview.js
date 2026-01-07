import React from 'react';

const TreeDensityPreview = () => {
  return (
    <div className="map-preview">
      <div className="map-preview-content">
        <svg width="100%" height="100%" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet">
          {/* Simple map-like visualization */}
          <rect width="200" height="120" fill="#f0f9ff" />
          {/* State-like shapes */}
          <path d="M 20 20 L 60 20 L 60 50 L 40 60 L 20 50 Z" fill="#1e40af" opacity="0.3" />
          <path d="M 80 30 L 120 30 L 120 70 L 100 80 L 80 70 Z" fill="#1e40af" opacity="0.5" />
          <path d="M 140 40 L 180 40 L 180 90 L 160 100 L 140 90 Z" fill="#1e40af" opacity="0.4" />
          <text x="100" y="60" textAnchor="middle" fontSize="8" fill="#1e40af" fontWeight="600">
            Tree Density
          </text>
        </svg>
      </div>
    </div>
  );
};

export default TreeDensityPreview;
