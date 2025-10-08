import React from 'react';
import ReactTooltip from 'react-tooltip';
import './style.scss';

import questionIcon from '../../../../assets/icons/help-circle.png';

const helpText = 'Choose your year, state, and<br />county or federal land area to view data.';

const explanatoryText = '<p>For over three decades, we\'ve been at the forefront of Southern Pine Beetle research, '
  + 'building the most comprehensive database of beetle activity across the Southeast. Our platform transforms '
  + 'decades of trapping data into actionable insights for researchers, forest managers, and conservation professionals.</p>'
  + '<strong>Quick Start Guide</strong>'
  + '<p>Ready to dive in? Use the download button above to access our data with powerful filtering options. '
  + 'Customize your search by time period, geographic region, and data format to get precisely the information you need.</p>'
  + '<strong>Data Formats</strong>'
  + '<ul><li><strong>Summarized Data:</strong> Processed and aggregated data optimized for analysis, reporting, and visualization</li>'
  + '<li><strong>Raw Data:</strong> Complete, unprocessed datasets for advanced research and custom analytical workflows</li></ul>'
  + '<p>Explore our interactive filters below to discover patterns across specific locations and time periods.</p>';

const OverviewText = (props) => {
  const { title = 'Historical Data' } = props;

  return (
    <div className="container" id="overview-explanation">
      <div className="container" id="overview-text">
        <h1 id="title">
          {title}
        </h1>
        <img id="icon"
          data-tip={helpText}
          src={questionIcon}
          alt="Help"
        />
        <ReactTooltip multiline place="right" />
      </div>
      <div className="explanatory-text">
        <div dangerouslySetInnerHTML={{ __html: explanatoryText }} />
      </div>
    </div>
  );
};

export default OverviewText;
