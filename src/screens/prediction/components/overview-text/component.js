import React from 'react';

const OverviewText = (_props) => (
  <div className="page-header">
    <h1>Predict Outbreak</h1>
    <p className="page-description">
      This tool uses annual trapping data and the most recent two years of spot data to predict the likelihood of an outbreak (greater than 50 spots per location) in the coming summer.
      Resource managers enter their trapping data from approximately March-June of each season. Each location traps over 4-6 weeks, and enters their data when complete.
      When complete data is entered, a prediction for that location becomes available on this page. Observed outcome data is usually uploaded in January following a summer season.
      At that point predictions vs. outcomes can be viewed visually here and also become available for download.
    </p>
  </div>
);

export default OverviewText;
