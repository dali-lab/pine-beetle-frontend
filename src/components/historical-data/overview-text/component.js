import React from 'react';

const OverviewText = (props) => {
  const { title = 'Historical Data' } = props;

  return (
    <div className="page-header">
      <h1>{title}</h1>
      <p className="page-description">
        Southern pine beetle trapping data have been collected across the southeast since 1988.
        All historical data are collected here in one place for researchers, forest resource managers, and the general public to access.
        Using the filter below, you can explore totals for different locations across your chosen length of time.
      </p>
    </div>
  );
};

export default OverviewText;
