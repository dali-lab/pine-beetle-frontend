import React from 'react';
import ReactTooltip from 'react-tooltip';
import './style.scss';

const questionIcon = require('../../../../assets/icons/help-circle.png');

const OverviewText = _props => (
  <div className="container">
    <h1 id="title">
      The Predictive Tool
    </h1>
    <img id="icon"
      data-tip="here is text if you need help!"
      src={questionIcon}
      alt="Help"
    />
    <ReactTooltip />


    {/* <p id="pred-model-intro-text">This page allows you to use the predictive tool to anticipate the severity of southern pine beetle spots in a given locality.
      The model requires four input variables: number of spots 2 years ago, number of spots 1 year ago, number of clerids 1 year ago, and number of
      Southern Pine Beetles this year. The model then returns the probability that the number of spots will be within certain pre-defined ranges.
      For convenience, this tool allows you to select a year, state, and/or forest and it will automatically input the data for that selection. Initially,
      the system will select the current year. You can also conduct “what-if” analysis, by clicking the “edit” button near the model inputs.
    </p> */}
  </div>
);

export default OverviewText;
