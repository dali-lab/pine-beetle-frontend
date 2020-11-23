import React from 'react';
import ReactTooltip from 'react-tooltip';
import './style.scss';

const questionIcon = require('../../../../assets/icons/help-circle.png');

const helpText = `Pick a year, state and<br />
county/ranger district to<br />
prepulate the fields based<br />
on historical data.`;

const OverviewText = _props => (
  <div className="container" id="overview-text">
    <h1 id="title">
      Play with the Model
    </h1>
    <div>
      <img id="icon"
        data-tip={helpText}
        src={questionIcon}
        alt="Help"
      />
      <ReactTooltip multiline place="right" />
    </div>
  </div>
);

export default OverviewText;
