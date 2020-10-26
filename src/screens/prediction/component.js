import React, { useEffect, useState } from 'react';

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
    predictionData,
    predictionsErrorText,
  } = props;

  const [predHTML, setPredHTML] = useState(<div />);

  const predDetails = (bool) => {
    if (bool) {
      return (
        <div>
          <div className="container" id="pred-header">Prediction Details</div>
          <div className="container" id="predictions">
            <div className="bar-chart">
              <BarChart data={predictionData} />
            </div>
            <div className="prediction-details">
              <PredictionDetails data={predictionData} />
            </div>
          </div>
        </div>
      );
    } else { return <div />; }
  };

  useEffect(() => {
    // prediction details only come up when year, state, county/rd specified
    setPredHTML(predDetails(predictionData.length === 1));
  }, [predictionData]);

  return (
    <div>
      {/* TODO: make this a spinner */}
      {isLoading && <p>Loading...</p>}
      {predictionsErrorText.length > 0 && predictionsErrorText.map(t => <p>{t}</p>)}
      <OverviewText />
      <SelectionBar />
      <PredictionMap />
      {/* TODO: Dynamically Change header */}
      { predHTML }
    </div>
  );
};

export default Prediction;
