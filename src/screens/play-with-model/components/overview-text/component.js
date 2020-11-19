import React from 'react';
import ReactTooltip from 'react-tooltip';
import './style.scss';

const questionIcon = require('../../../../assets/icons/help-circle.png');

// TODO: make new tool tip text
const helpText = `Please input desired fields to generate outbreak predictions.<br />
  For your reference, the selection bar helps you <br />
  fill in fields based on year, state, and county. <br />
  Click the run button to generate predictions.`;

const OverviewText = _props => (
  <div className="container">
    <h1 id="title">
      Play with the Model
    </h1>
    <img id="icon"
      data-tip={helpText}
      src={questionIcon}
      alt="Help"
    />
    <ReactTooltip multiline="true" place="right" />
  </div>
);

export default OverviewText;
