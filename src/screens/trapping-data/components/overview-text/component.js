import React from 'react';
import ReactTooltip from 'react-tooltip';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import './style.scss';

const questionIcon = require('../../../../assets/icons/help-circle.png');

const helpText = `Please select year, state, and<br />
county/RD for trapping data.<br />
You can switch between map or chart<br />
view by toggling the button below.`;

const explanatoryText = `Southern pine beetle trapping data has been collected across the Southeast since 1988,
and now,increasingly, in the Mid-Atlantic and Northeast. All historical data is collected here in one place for 
researchers, forest resource managers, and the general public to access. [Insert explanation here for all the 
different ways the data can be downloaded, so users know that ALL forms of the data, both raw (weekly) and 
summarized (every two weeks; the input version used for the model) are available.`;

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
