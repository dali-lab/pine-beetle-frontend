import React, { useState, useEffect } from 'react';

import './style.scss';

const PlayWithModelOutputs = (props) => {
  const {
    county,
    customPrediction, // result of prediction output
    dataMode,
    error, // error object if one occurred
    isError, // whether or not an error occurred
    isLoading, // whether or not we are loading (i.e. running the model)
    rangerDistrict,
    selectedState,
    year,
  } = props;

  const probSpots = customPrediction?.['prob.Spots>0'];
  const probOutbreak = customPrediction?.['prob.Spots>53'];
  // eslint-disable-next-line no-restricted-globals
  const validCustomPredictions = !isError && !isLoading && !isNaN(probSpots) && !isNaN(probOutbreak);

  const [showPredictions, setShowPredictions] = useState(false);

  // synchronize showing of predictions to whether valid ones exist
  useEffect(() => {
    setShowPredictions(validCustomPredictions);
  }, [validCustomPredictions]);

  // but override them when we switch selections
  useEffect(() => {
    setShowPredictions(false);
  }, [county, selectedState, year, dataMode, rangerDistrict]);

  const predictionDetails = () => (
    <>
      <div id={showPredictions ? 'prob-spots' : 'prob-spots-disabled'}>
        <div id="percent">
          {showPredictions
            ? `${(probSpots * 100).toFixed(1)}%`
            : '--'}
        </div>
        <div id="prob-text">
          <p>Predicted % Chance of Any Spots ({'>'}0 spots)</p>
        </div>
      </div>
      <div id={showPredictions ? 'prob-outbreak' : 'prob-outbreak-disabled'}>
        <div id="percent">
          {showPredictions
            ? `${(probOutbreak * 100).toFixed(1)}%`
            : '--'}
        </div>
        <div id="prob-text">
          <p>Predicted % Chance of Outbreak ({'>'}50 spots)</p>
        </div>
      </div>
    </>
  );

  const predictionTitle = () => {
    if (isLoading) {
      return 'Generating predictions...';
    } else if (isError) {
      return `${error.text}. Please make sure all fields are entered correctly`;
    } else if (showPredictions) {
      return 'Predictions based on model inputs';
    } else {
      return 'Input desired fields and press run to generate predictions';
    }
  };

  return (
    <div id="predictions-output">
      <div id="vl" />
      <div className="predictions-generated">
        <div id="predictions-generated-title">
          <p>{predictionTitle()}</p>
        </div>
        {predictionDetails()}
      </div>
    </div>
  );
};

export default PlayWithModelOutputs;
