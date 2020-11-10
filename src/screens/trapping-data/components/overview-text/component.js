import React from 'react';
import ReactTooltip from 'react-tooltip';
import './style.scss';

const questionIcon = require('../../../../assets/icons/help-circle.png');

const helpText = 'Please select year, state, and county/RD for historical data.<br />You can switch between map or chart view by toggling the button below.';

const OverviewText = _props => (
  <div className="container">
    <h1 id="title">
      Trapping &amp; Spot Data
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
