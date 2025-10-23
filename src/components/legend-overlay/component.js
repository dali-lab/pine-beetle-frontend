import React, { useState } from 'react';
import './style.scss';

const LegendOverlay = ({
  legendItems, title = 'Legend', className = '', onClose,
}) => {
  const [showLegend, setShowLegend] = useState(className?.includes('embedded-control') || className?.includes('legend-mobile-fullscreen-overlay'));

  if (!showLegend && !className?.includes('legend-mobile-fullscreen-overlay')) {
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
      {/* Close button for mobile */}
      {onClose && (
        <button
          type="button"
          className="legend-close-button"
          onClick={onClose}
          aria-label="Close legend"
        >
          ×
        </button>
      )}
      <div className="legend-header">
        <h3 className="legend-title">{title}</h3>
        {!className?.includes('legend-mobile-fullscreen-overlay') && (
          <button
            type="button"
            onClick={() => setShowLegend(false)}
            className="legend-close-button"
          >
            ×
          </button>
        )}
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
