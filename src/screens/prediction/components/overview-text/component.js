import React from 'react';
import ReactTooltip from 'react-tooltip';
import './style.scss';

import questionIcon from '../../../../assets/icons/help-circle.png';

const helpText = `This tool uses annual trapping data and the most recent two years of 
spot data to predict the likelihood of an outbreak (greater than 50 spots per location) in the coming summer. 
Resource managers enter their trapping data from approximately March-June of each season. Each location traps 
over 4-6 weeks, and enters their data when complete. When complete data is entered, a prediction for that 
location becomes available on this page. Observed outcome data is usually uploaded in January following a 
summer season. At that point predictions vs. outcomes can be viewed visually here and also become available 
for download.`;

const explanatoryText = `Click one time to zoom to your state of interest. From there, clicking on a particular county 
or ranger district will open a pop-up window with additional information about the prediction for that county/ranger district.`;

const OverviewText = (_props) => (
  <div className="container" id="overview-explanation">
    <div className="container" id="overview-text">
      <h1 id="title">
        Predict Outbreak
      </h1>
      <img id="icon"
        data-tip={helpText}
        src={questionIcon}
        alt="Help"
      />
      <ReactTooltip className="overview-text-tooltip" multiline place="right" />
    </div>
    <div>
      <p className="explanatory-text">
        {explanatoryText}
      </p>
    </div>
  </div>

);

export default OverviewText;
