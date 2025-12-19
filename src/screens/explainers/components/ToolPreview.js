import React from 'react';

const ToolPreview = () => (
  <div className="preview-visual tool-preview-visual">
    <div className="prediction-results-preview">
      <div className="prediction-card prob-spots">
        <div className="prediction-percent">3.4%</div>
        <div className="prediction-label">Predicted % Chance of Any Spots (&gt;0 spots)</div>
      </div>
      <div className="prediction-card prob-outbreak">
        <div className="prediction-percent">0.2%</div>
        <div className="prediction-label">Predicted % Chance of Outbreak (&gt;50 spots)</div>
      </div>
    </div>
  </div>
);

export default ToolPreview;
