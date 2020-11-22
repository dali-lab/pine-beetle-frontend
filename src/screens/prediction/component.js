/* eslint-disable no-unused-vars */
import React from 'react';

import {
  AboutPredictions,
  OverviewText,
  PredictionDetails,
  PredictionMap,
  SelectionBar,
} from './components';

import './style.scss';

const histogrambin1 = require('../../assets/images/spb-histogram-bin1.png');
const histogrambin2 = require('../../assets/images/spb-histogram-bin2.png');
const histogrambin3 = require('../../assets/images/spb-histogram-bin3.png');
const histogrambin4 = require('../../assets/images/spb-histogram-bin4.png');
const histogrambin5 = require('../../assets/images/spb-histogram-bin5.png');
const histogrambin6 = require('../../assets/images/spb-histogram-bin6.png');

const Prediction = (props) => {
  const {
    isLoading,
    predictionData,
    predictionsErrorText,
    selectedState,
  } = props;

  const getHistogram = (predProb50) => {
    if (predProb50 < 0.025) {
      return histogrambin1;
    } else if (predProb50 < 0.05) {
      return histogrambin2;
    } else if (predProb50 < 0.15) {
      return histogrambin3;
    } else if (predProb50 < 0.25) {
      return histogrambin4;
    } else if (predProb50 < 0.4) {
      return histogrambin5;
    } else {
      return histogrambin6;
    }
  };

  const predDetails = (hasPredData) => {
    if (!hasPredData) return null;
    const predProb50 = predictionData[0].prediction['prob.Spots>53'];
    const histogram = getHistogram(predProb50);
    return (
      <div className="container">
        <PredictionDetails data={predictionData} />
        <div className="prediction-bottom">
          <div className="histogram">
            <div id="histogram-title">
              <span>
                Predicted vs. Observed Outcomes for All Data, 1987-2019 (n=2,978)
              </span>
            </div>
            <img
              src={histogram}
              alt="Histogram for Predicted % Chance of >50 Spots"
            />
          </div>
          <AboutPredictions />
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* TODO: make this a spinner */}
      {isLoading && <p>Loading...</p>}
      {predictionsErrorText.length > 0 && predictionsErrorText.map(t => <p>{t}</p>)}
      <OverviewText />
      <SelectionBar />
      <PredictionMap data={selectedState} />
      { predDetails(predictionData.length === 1) }
    </div>
  );
};

export default Prediction;
