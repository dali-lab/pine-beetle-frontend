import React from 'react';

const VideoPreview = () => (
  <div className="preview-visual video-preview-visual">
    <div className="video-overlay" />
    <div className="play-button-container">
      <div className="play-button">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      </div>
    </div>
    <div className="progress-bar">
      <div className="progress-fill" />
    </div>
  </div>
);

export default VideoPreview;
