import React from 'react';
import './style.scss';

const daliLogo = require('../../assets/icons/dali_dark.png');

const Footer = () => (
  <div id="footer">
    <div id="footer-container">
      <div />
      <p>Designed and developed in the DALI Lab.</p>
      <a href="http://dali.dartmouth.edu/" target="_blank" rel="noopener noreferrer">
        <img id="dali-logo" src={daliLogo} alt="DALI Lab Logo" />
      </a>
    </div>
    <div style={{ clear: 'both' }} />
  </div>
);

export default Footer;
