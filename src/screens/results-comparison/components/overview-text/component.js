import React from 'react';
import ReactTooltip from 'react-tooltip';
import './style.scss';

import questionIcon from '../../../../assets/icons/help-circle.png';

const helpText = `Click once to zoom into a state. From there, clicking on a county or ranger district 
will open a pop-up with additional details on the prediction and actual results for that area.`;

const explanatoryText = `This map compares predictions to actual results, with four possible categories 
displayed using color-coded shading. Darker shades indicate that we were right in our predictions, while lighter shades indicate that we were wrong. 
The legend provides details on each category`;

const OverviewText = (_props) => (
  <div className="container" id="overview-explanation">
    <div className="container" id="overview-text">
      <h1 id="title">
        How did we do?
      </h1>
      <img id="icon"
        data-tip={helpText}
        src={questionIcon}
        alt="Help"
      />
      <ReactTooltip multiline place="right" />
    </div>
    <div>
      <p>
        {explanatoryText}
      </p>
    </div>
  </div>

);

export default OverviewText;
