import React from 'react';

import './style.scss';

const PlayWithModelOutputs = (props) => {
  const {
    error, // error object if one occurred
    isError, // whether or not an error occurred
    isLoading, // whether or not we are loading (i.e. running the model)
    customPrediction, // result of prediction output
  } = props;

  const probSpots = customPrediction?.['prob.Spots>0'];
  const probOutbreak = customPrediction?.['prob.Spots>53'];
  // eslint-disable-next-line no-restricted-globals
  const validCustomPredictions = !isError && !isLoading && !isNaN(probSpots) && !isNaN(probOutbreak);

  const predictionDetails = () => (
    <>
      <div id={validCustomPredictions ? 'prob-spots' : 'prob-spots-disabled'}>
        <div id="percent">
          {validCustomPredictions
            ? `${(probSpots * 100).toFixed(1)}%`
            : '--'}
        </div>
        <div id="prob-text">
          <p>Predicted % Chance of Any Spots ({'>'}0 spots)</p>
        </div>
      </div>
      <div id={validCustomPredictions ? 'prob-outbreak' : 'prob-outbreak-disabled'}>
        <div id="percent">
          {validCustomPredictions
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
      return <p>Generating predictions...</p>;
    } else if (isError) {
      return (
        <>
          <p>{error.text}.</p>
          <p>Please make sure all fields are entered correctly</p>
        </>
      );
    } else if (validCustomPredictions) {
      return <p>Predictions based on model inputs</p>;
    } else {
      return <p>Input desired fields and press run to generate predictions</p>;
    }
  };

  return (
    <div id="predictions-output">
      <div id="vl" />
      <div className="predictions-generated">
        <div id="predictions-generated-title">
          {predictionTitle()}
        </div>
        {predictionDetails()}
      </div>
    </div>
  );
};

export default PlayWithModelOutputs;
