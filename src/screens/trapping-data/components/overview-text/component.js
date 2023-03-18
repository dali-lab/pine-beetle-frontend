import React from 'react';
import ReactTooltip from 'react-tooltip';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import './style.scss';

import questionIcon from '../../../../assets/icons/help-circle.png';

const helpText = 'Please select year, state, and<br />county/RD for trapping data.';

const explanatoryText = `Southern pine beetle trapping data have been collected across the southeast since 1988, 
and now, increasingly, in the mid-Atlantic and northeast. All historical data are collected here in one place 
for researchers, forest resource managers, and the general public to access. You can select the year range and 
location, and you can switch between map and graph view by toggling the button below.`;

const OverviewText = (_props) => (
  <div className="container" id="overview-explanation">
    <div className="container" id="overview-text">
      <h1 id="title">
        Historical Data
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
