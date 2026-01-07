import React, { useState } from 'react';
import './style.scss';

const ScrollableTextBox = ({
  title = 'Information',
  text = '',
  isExpanded: initialExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className="scrollable-text-box-toggle-button"
      >
        <span className="scrollable-text-box-icon">ⓘ</span>
        <span className="scrollable-text-box-toggle-text">{title}</span>
      </button>
    );
  }

  return (
    <div className="scrollable-text-box">
      <div className="scrollable-text-box-header">
        <div className="scrollable-text-box-header-left">
          <span className="scrollable-text-box-header-icon">ⓘ</span>
          <h3 className="scrollable-text-box-title">{title}</h3>
        </div>
        <div className="scrollable-text-box-header-right">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="scrollable-text-box-collapse-button"
            aria-label="Collapse"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div className="scrollable-text-box-content-wrapper">
        <div className="scrollable-text-box-content">
          {typeof text === 'string' ? (
            <p>{text}</p>
          ) : (
            text
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrollableTextBox;
