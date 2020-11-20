import React from 'react';
import ReactTooltip from 'react-tooltip';
import './style.scss';

const questionIcon = require('../../../../assets/icons/help-circle.png');

const helpText = 'Please select year, state, and county/RD for predictions.<br />After selecting a specific county or RD,<br />you can see prediction breakdown below the map.';

const OverviewText = _props => (
  <div className="container">
    <h1 id="title">
      The Predictive Tool
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
