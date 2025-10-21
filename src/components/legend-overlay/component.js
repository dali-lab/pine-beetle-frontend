import React, { useState } from 'react';
import './style.scss';

const LegendOverlay = ({ legendItems, title = 'Legend', className = '' }) => {
  const [showLegend, setShowLegend] = useState(className?.includes('embedded-control') || className?.includes('mobile-fullscreen-overlay'));

  if (!showLegend) {
    return (
      <button
        type="button"
        onClick={() => setShowLegend(true)}
        className={`legend-toggle-button ${className}`}
      >
        <span className="legend-info-icon">ⓘ</span>
        Show Legend
      </button>
    );
  }

  return (
    <div className={`legend-overlay ${className}`}>
      <div className="legend-header">
        <h3 className="legend-title">{title}</h3>
        <button
          type="button"
          onClick={() => setShowLegend(false)}
          className="legend-close-button"
        >
          ×
        </button>
      </div>
      <div className="legend-content">
        {legendItems.map((item) => (
          <div key={`legend-item-${item.label.replace(/[^a-zA-Z0-9]/g, '-')}`} className="legend-item">
            <div
              className="legend-color-box"
              style={{ backgroundColor: item.color }}
            />
            <span className="legend-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegendOverlay;
