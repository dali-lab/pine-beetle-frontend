import React from 'react';

const MinWinterTempPreview = () => {
  return (
    <div className="map-preview">
      <div className="map-preview-content">
        <svg width="100%" height="100%" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet">
          {/* Simple map-like visualization with temperature gradient */}
          <defs>
            <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
          </defs>
          <rect width="200" height="120" fill="url(#tempGradient)" opacity="0.3" />
          {/* Temperature zones */}
          <path d="M 20 20 L 60 20 L 60 50 L 40 60 L 20 50 Z" fill="#3b82f6" opacity="0.4" />
          <path d="M 80 30 L 120 30 L 120 70 L 100 80 L 80 70 Z" fill="#60a5fa" opacity="0.5" />
          <path d="M 140 40 L 180 40 L 180 90 L 160 100 L 140 90 Z" fill="#93c5fd" opacity="0.4" />
          <text x="100" y="55" textAnchor="middle" fontSize="7" fill="#1e40af" fontWeight="600">
            Min Winter Temp
          </text>
          <text x="100" y="70" textAnchor="middle" fontSize="6" fill="#1e40af" opacity="0.7">
            Time Series
          </text>
        </svg>
      </div>
    </div>
  );
};

export default MinWinterTempPreview;
