import React from 'react';

import './style.scss';

import beetleImage from '../../assets/icons/mobile-beetle.png';

const MobileOverlay = () => (
  <div id="mobile-overlay">
    <div id="inner-container">
      <img src={beetleImage} alt="Beetle icon" />
      <h4>Pine Beetle Prediction Website</h4>
      <p>We apologize, but this website is not compatible with mobile devices. Please navigate to a desktop to proceed.</p>
    </div>
  </div>
);

export default MobileOverlay;
