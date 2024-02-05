import React from 'react';
import { VIDEO_URL } from '../../../../constants';

import './style.scss';

const Video = () => {
  return (
    <div className="page-container video-page-container">
      <div className="home-content-section-title">Learn more from the video</div>
      <div id="video-container">
        <div id="video-wrapper">
          <iframe
            title="Pine Beetle Description Video"
            src={VIDEO_URL}
            frameBorder="0"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default Video;
