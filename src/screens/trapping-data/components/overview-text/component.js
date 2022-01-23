import React from 'react';
import ReactTooltip from 'react-tooltip';
import './style.scss';

const questionIcon = require('../../../../assets/icons/help-circle.png');

const helpText = `Please select year, state, and<br />
county/RD for trapping data.<br />
You can switch between map or chart<br />
view by toggling the button below.`;

const OverviewText = _props => (
  <div className="container" id="overview-explanation">
    <div className="container" id="overview-text">
      <h1 id="title">
        Historical and Model Input Data
      </h1>
      <img id="icon"
        data-tip={helpText}
        src={questionIcon}
        alt="Help"
      />
      <ReactTooltip multiline place="right" />
    </div>
    <p id="explanatory-text">Southern pine beetle trapping data has been collected across the Southeast since 1988, and now,
      increasingly, in the Mid-Atlantic and Northeast. All historical data is collected here in one place
      for researchers, forest resource managers, and the general public to access. [Insert explanation here
      for all the different ways the data can be downloaded, so users know that ALL forms of the data, both raw
      (weekly) and summarized (every two weeks; the input version used for the model) are available.]
    </p>
    <p id="explanatory-text">
      Past predictions and observed outcomes can also be visualized and downloaded here. [Insert explanation here
      (or link to further explanation) for the different ways to view the predicted/observed information.]
    </p>
  </div>

);

export default OverviewText;
