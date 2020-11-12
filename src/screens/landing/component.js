import React from 'react';
// import { Link } from 'react-router-dom';
import './style.scss';

const beetleIcon = require('../../assets/icons/background-beetle.png');

const Landing = (_props) => {
  return (
    <div className="container">
      <div className="title-area">
        <img src={beetleIcon} alt="beetle" />
        <div className="title-words">
          <div id="big-title">Pine Beetle</div>
          <div id="subtitle">Outbreak Prediction</div>
          <div id="title-description">
            This website predicts the likelihood of a summer outbreak based on spring trapping data, with the goal of assisting forest managers as they make resource allocation decisions.
          </div>
        </div>
      </div>
      <div className="pages">links here</div>
      <div className="video">Video here</div>
      <div className="how-it-works">hi:)</div>
    </div>
  );
};

export default Landing;
