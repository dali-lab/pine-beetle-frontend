import React from 'react';

import {
  BarChart,
  OverviewText,
  PredictionDetails,
  PredictionMap,
  SelectionBar,
} from './components';

import './style.scss';

const Prediction = (props) => {
  const {
    isLoading,
    predictionsErrorText,
    // spotData,
  } = props;

  return (
    <div>
      {/* TODO: make this a spinner */}
      {isLoading && <p>Loading...</p>}
      {predictionsErrorText.length > 0 && predictionsErrorText.map(t => <p>{t}</p>)}
      <OverviewText />
      <SelectionBar />
      <PredictionMap />
      {/* TODO: Dynamically Change header */}
      <div className="container" id="pred-header">Prediction Details</div>
      <div className="container" id="predictions">
        <div className="bar-chart">
          <BarChart data={[1, 0.5, 0.25, 0.15, 0]} />
        </div>
        <div className="prediction-details">
          <PredictionDetails />
        </div>
      </div>
    </div>
  );
};

export default Prediction;
