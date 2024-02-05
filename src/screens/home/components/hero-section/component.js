import React from 'react';

import beetleIcon from '../../../../assets/icons/background-beetle-color.png';
import './style.scss';

const HeroSection = () => {
  return (
    <div className="hero-section-container">
      <div id="beetle-background">
        <img src={beetleIcon} alt="beetle" />
      </div>
      <div className="title-words">
        <h1 id="big-title">Southern Pine Beetle</h1>
        <h2>(Dendroctonus frontalis)</h2>
        <h3 id="subtitle">Annual Outbreak Predictions and Historical Database <br />(1988-present)
        </h3>
        <div id="title-description">
          This website predicts the likelihood of a summer outbreak based on spring trapping data, with the goal of assisting forest managers as they make resource allocation decisions.
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
