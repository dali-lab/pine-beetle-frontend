import React from 'react';
import ReactTooltip from 'react-tooltip';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import './style.scss';

const questionIcon = require('../../../../assets/icons/help-circle.png');

const helpText = `Please select year, state, and county/RD for predictions.<br />
After selecting a specific county or RD,<br />
you can see prediction breakdown below the map.`;

const explanatoryText = `This tool uses annual trapping data and the most recent two years of 
spot data to predict the likelihood of an outbreak (greater than 50 spots per location) in the coming summer. 
Resource managers enter their trapping data from approximately March-June of each season. Each location traps 
over 4-6 weeks, and enters their data when complete. When complete data is entered, a prediction for that 
location becomes available on this page. Observed outcome data is usually uploaded in January following a 
summer season. At that point predictions vs. outcomes can be viewed visually here and also become available 
for download.`;

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
      <ReactTooltip multiline place="right" />
    </div>
    <div>
      <ReactReadMoreReadLess
        charLimit={250}
        readMoreText="Read more"
        readLessText="Read less"
        readMoreClassName="read-more-less--more"
        readLessClassName="read-more-less--less"
      >
        {explanatoryText}
      </ReactReadMoreReadLess>
    </div>
  </div>

);

export default OverviewText;
