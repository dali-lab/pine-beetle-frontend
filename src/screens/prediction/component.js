import React from 'react';

import { OverviewText, StateMap } from './components';

import './style.scss';

const Prediction = (_props) => {
  return (
    <div>
      <OverviewText />
      <div className="container" id="pred-select-state-text">
        <h3>Please select a state to run the predictive model.</h3>
        <p>It will take a few seconds to run. Please be patient.</p>
      </div>
      <StateMap />
    </div>
  );
};

export default Prediction;
