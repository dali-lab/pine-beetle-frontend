import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const Landing = (_props) => {
  return (
    <div id="home-outer-container">
      <div id="home-landing-container">
        <h1>Predicting Southern Pine Beetle Outbreaks</h1>
        <p>This prototype exhibits the first steps in a months-long process to develop a fully deployed tool to visualize and predict
          trends in Southern Pine Beetle movements throughout the United States.
        </p>
        <p id="home-last">See the historical data page for metrics on previous years and the predictive model page to generate expectations about the future.</p>
        <Link to="/historical-data" id="hist-data-link" className="home-button">Historical Data</Link>
        <Link to="/predictions" id="pred-model-link" className="home-button">Predictive Model</Link>
        <p id="home-last" />
      </div>
    </div>
  );
};

export default Landing;
