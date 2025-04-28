import React from 'react';
import ReactTooltip from 'react-tooltip';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import './style.scss';

import questionIcon from '../../../../assets/icons/help-circle.png';

const helpText = 'Please select year, state, and<br />county/RD for trapping data.';

const explanatoryText = `Southern pine beetle trapping data have been collected across the southeast 
since 1988. All historical data are collected here in one place for researchers, forest resource managers, 
and the general public to access. Download data using the green button at the top right of your screen. 
A new selection screen will allow you to choose your time and area of interest, and whether you want 
summarized or unsummarized data (the data used in the model summarizes across all traps and all collection dates 
for a given location). Using the filter below, you can explore totals for different locations across your chosen length of time.`;

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
    <div className="explanatory-text">
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
