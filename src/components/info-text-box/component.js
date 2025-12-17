import React, { useState } from 'react';
import './style.scss';

const InfoTextBox = ({
  text = 'SPBpredict provides annual predictions of southern pine beetle (Dendroctonus frontalis) outbreak across the southeast for both counties and National Forests. Predictions are based on both annual trapping data provided by states and the U.S. Forest Service, as well as on outbreak occurrence for the past two years. Outbreak and trapping data are also available for download from 1988 to the present.',
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className="info-text-box-toggle-button"
      >
        <span className="info-text-box-icon">ⓘ</span>
        <span className="info-text-box-toggle-text">About SPBpredict</span>
      </button>
    );
  }

  return (
    <div className="info-text-box">
      <div className="info-text-box-header">
        <div className="info-text-box-header-left">
          <span className="info-text-box-header-icon">ⓘ</span>
          <h3 className="info-text-box-title">About SPBpredict</h3>
        </div>
        <div className="info-text-box-header-right">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="info-text-box-collapse-button"
            aria-label="Collapse"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div className="info-text-box-content-wrapper">
        <div className="info-text-box-content">
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoTextBox;
