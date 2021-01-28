import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, VIDEO_URL } from '../../constants';
import './style.scss';

const beetleIcon = require('../../assets/icons/background-beetle-color.png');
const howItWorksIcon = require('../../assets/icons/how-it-works.png');
const modelOutbreakIcon = require('../../assets/icons/model-outbreaks.png');
const testInputIcon = require('../../assets/icons/test-inputs.png');
const statsIcon = require('../../assets/icons/stats.png');
const zeroIcon = require('../../assets/icons/zero.png');

const Home = (_props) => {
  return (
    <div className="container" id="home-container">
      <div id="beetle-background">
        <img src={beetleIcon} alt="beetle" />
      </div>
      <div className="title-words">
        <div id="big-title">Pine Beetle</div>
        <div id="subtitle">Outbreak Prediction</div>
        <div id="title-description">
          This website predicts the likelihood of a summer outbreak based on spring trapping data, with the goal of assisting forest managers as they make resource allocation decisions.
        </div>
      </div>
      <div className="pages">
        <div className="page-container" id="left-page-container">
          <div id="page-name">Predictions</div>
          <div id="summary">
            Predictions are updated weekly as trapping data are entered, and can be viewed by counties within states, as well as by USFS ranger districts within National Forests.
          </div>
          <Link to={ROUTES.PREDICTIONS} className="animated-button" id="click-to">
            View predictions
          </Link>
        </div>
        <div className="page-container">
          <div id="page-name">Trapping data</div>
          <div id="summary">
            Trapping data collected since 2011 were used to build the prediction model on this website. View and download the data here. Data can be filtered by years and/or locations.
          </div>
          <Link to={ROUTES.TRAPPING_DATA} className="animated-button" id="click-to">
            View trapping data
          </Link>
        </div>
        <div className="page-container" id="right-page-container">
          <div id="page-name">Play with the model</div>
          <div id="summary">
            Trapping data collected since 2011 were used to build the prediction model on this website. View and download the data here with years and/or location filters.
          </div>
          <Link to={ROUTES.PLAY_WITH_MODEL} className="animated-button" id="click-to">
            Play with the model
          </Link>
        </div>
      </div>
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
      <div className="how-it-works">
        <div id="how-it-works-title-container">
          <div id="icon0">
            <img
              id="icon"
              src={howItWorksIcon}
              alt="how it works icon"
            />
          </div>
          <div id="vl" />
          <div id="description-title">How does it work?</div>
        </div>
        <div id="description-container">
          <div id="description-title-container">
            <div id="icon1">
              <img
                id="icon"
                src={modelOutbreakIcon}
                alt="model outbreak icon"
              />
            </div>
            <div id="vl" />
            <div id="description-title">Model the Outbreaks</div>
          </div>
          <div id="description-text">
            We decided not to use traditional modeling techniques that involve modeling the beetles themselves;
            instead, we model the number of infestations, commonly referred to as “spots.”
            Complex population models are often difficult to fit to real data,
            so we opted for an approach that would allow us to use spot data that was already being collected by state forest service agencies and their federal counterparts.
          </div>
        </div>
        <div id="description-container">
          <div id="description-title-container">
            <div id="icon2">
              <img
                id="icon"
                src={statsIcon}
                alt="statistics icon"
              />
            </div>
            <div id="vl" />
            <div id="description-title">Use a Statistical Model</div>
          </div>
          <div id="description-text">
            Rather than using a complex mathematical model, we used a statistical method known as “zero-inflation.”
            It’s basically a fancy version of regression, one of the most basic statistical techniques.
          </div>
        </div>
        <div id="description-container">
          <div id="description-title-container">
            <div id="icon3">
              <img
                id="icon"
                src={zeroIcon}
                alt="zero inflations icon"
              />
            </div>
            <div id="vl" />
            <div id="description-title">Zero Inflation</div>
          </div>
          <div id="description-text">
            Because most locations in most years do not experience an outbreak, a very large number of zeroes occurs in the data over the course of
            the three decades that data have been collected. This means that traditional statistics methods cannot be applied.
            Zero-inflation, however, is designed for precisely this kind of data, and we think it might prove to be a robust method for other kinds of irregularly outbreaking insects—not just SPB.
          </div>
        </div>
        <div id="description-container">
          <div id="description-title-container">
            <div id="icon4">
              <img
                id="icon"
                src={testInputIcon}
                alt="test input variables icon"
              />
            </div>
            <div id="vl" />
            <div id="description-title">Test Input Variables</div>
          </div>
          <div id="description-text">
            In any prediction model, there are “predictor variables” that help determine the prediction.
            For example, some combination of temperature, precipitation, and soil nutrients might predict crop productivity.
            To create our model of outbreak probability, we tested the following potential predictor variables: # of SPB, # of clerids, ratio of SPB/clerids,
            the three preceding variables both this year and last year, # of spots last year, and # of spots the year before.
            We also tested the size of the forest resource in each location (how many acres of SPB host trees were available).
            Of these, only # of SPB this year, # of clerids last year, and the two previous years of spot numbers were helpful in predicting the probability of outbreak.
            We continue to use these four variables in creating our model predictions. We will evaluate the predictor variables each year, potentially adding more in the future.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
