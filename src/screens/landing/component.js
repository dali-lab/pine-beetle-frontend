import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
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
      <div className="pages">
        <div className="page-container" id="left-page-container">
          <div id="page-name">Predictions</div>
          <div id="summary">
            Predictions are updated weekly as trapping data are entered, and can be viewed by counties within states, as well as by USFS ranger districts within National Forests.
          </div>
          <Link to={ROUTES.PREDICTIONS}>
            <btn id="click-to">
              View Predictions
            </btn>
          </Link>
        </div>
        <div className="page-container">
          <div id="page-name">Trapping data</div>
          <div id="summary">
            Trapping data collected since 2011 were used to build the prediction model on this website. View and download the data here. Data can be filtered by years and/or locations.
          </div>
          <Link to={ROUTES.HISTORICAL_DATA}>
            <btn id="click-to">
              View trapping data
            </btn>
          </Link>
        </div>
        <div className="page-container" id="right-page-container">
          <div id="page-name">Play with the model</div>
          <div id="summary">
            Trapping data collected since 2011 were used to build the prediction model on this website. View and download the data here with years and/or locations filter.
          </div>
          <Link to={ROUTES.PLAY_WITH_MODEL}>
            <btn id="click-to">
              Play with the model
            </btn>
          </Link>
        </div>
      </div>
      <div className="video">Video here</div>
      <div className="how-it-works">
        <div id="description-container">
          <div id="icon">icon</div>
          <div id="description">
            <div id="description-title">title</div>
            <div id="description-text">blahblahblah hiiiii</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
