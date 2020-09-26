import React from 'react';
import './style.scss';

const loadingGif = require('../../assets/load-icon.gif');

const Loading = () => (
  <div className="flex-container" id="loading-container">
    <div className="container flex-item">
      <div id="loading-gif-area">
        <h2>Loading Data...</h2>
        <img src={loadingGif} width="150" height="150" alt="loading-gif" />
      </div>

      <div id="suggestion-section">
        <p>Thanks for visiting the pine beetle prediction tool! Have a suggestion?</p>
        <p>Let us know at <a href="mailto:pine-beetle@dali.dartmouth.edu">pine-beetle@dali.dartmouth.edu</a>.</p>
      </div>
    </div>
  </div>
);

export default Loading;
