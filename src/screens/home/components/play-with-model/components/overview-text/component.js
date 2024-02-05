import React from 'react';
import ReactTooltip from 'react-tooltip';
import './style.scss';

import questionIcon from '../../../../../../assets/icons/help-circle.png';

const helpText = `Pick a year, state and<br />
county/ranger district to<br />
prepopulate the fields based<br />
on historical data.`;

const OverviewText = (_props) => (
  <div className="play-with-model-overview-text">
    <h1 className="home-content-section-title">
      Play with the Model
    </h1>
    <div>
      <img className="play-with-model-icon"
        data-tip={helpText}
        src={questionIcon}
        alt="Help"
      />
      <ReactTooltip multiline place="right" />
    </div>
  </div>
);

export default OverviewText;
