import React from 'react';
import './style.scss';

const daliLogo = require('../../assets/dali_dark.png');

const Footer = () => (
  <div id="footer">
    <div className="container">
      <p>Designed and developed in the DALI Lab.</p>
      <a href="http://dali.dartmouth.edu/" target="_blank" rel="noopener noreferrer">
        <img id="dali-logo" src={daliLogo} width="102px" height="39px" alt="DALI Lab Logo" />
      </a>
    </div>
    <div style={{ clear: 'both' }} />
  </div>
);

export default Footer;
