import React from 'react';
import PlayIcon from './Icons';

const VideoPreview = () => (
  <div className="preview-visual video-preview-visual">
    <div className="video-overlay" />
    <div className="play-button-container">
      <div className="play-button">
        <PlayIcon />
      </div>
    </div>
    <div className="progress-bar">
      <div className="progress-fill" />
    </div>
  </div>
);

export default VideoPreview;
