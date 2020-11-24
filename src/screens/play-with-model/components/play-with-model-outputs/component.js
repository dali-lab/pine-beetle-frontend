import React from 'react';

import './style.scss';

const PlayWithModelOutputs = (props) => {
  const {
    error, // error object if one occurred
    isError, // whether or not an error occurred
    isLoading, // whether or not we are loading (i.e. running the model)
    customPrediction, // result of prediction output
  } = props;

  const predictionDetails = enabled => (
    <>
      <div id={enabled ? 'prob-spots' : 'prob-spots-disabled'}>
        <div id="percent">
          {enabled
            ? (`${(customPrediction['prob.Spots>0'] * 100).toFixed(1)}%`)
            : '--'}
        </div>
        <div id="prob-text">
          <p>Predicted % Chance of Any Spots ({'>'}0 spots)</p>
        </div>
      </div>
      <div id={enabled ? 'prob-outbreak' : 'prob-outbreak-disabled'}>
        <div id="percent">
          {enabled
            ? (`${(customPrediction['prob.Spots>53'] * 100).toFixed(1)}%`)
            : '--'}
        </div>
        <div id="prob-text">
          <p>Predicted % Chance of Outbreak ({'>'}50 spots)</p>
        </div>
      </div>
    </>
  );

  const haveCustomPredictions = Object.keys(customPrediction).length !== 0;

  if (isLoading) {
    return (
      <div className="predictions-generated">
        <div id="predictions-generated-title">
          <p>Generating predictions...</p>
        </div>
        {predictionDetails(false)}
      </div>
    );
  } else if (isError) {
    return (
      <div className="predictions-generated">
        <div id="predictions-generated-title">
          <p>{error.text}.</p>
          <p>Please make sure all fields are entered correctly</p>
        </div>
        {predictionDetails(false)}
      </div>
    );
  } else if (haveCustomPredictions) {
    return (
      <div className="predictions-generated">
        <div id="predictions-generated-title">
          <p>Predictions based on model inputs</p>
        </div>
        {predictionDetails(true)}
      </div>
    );
    // eslint-disable-next-line no-restricted-globals
  } else if (haveCustomPredictions && (isNaN(customPrediction['prob.Spots>0']) || isNaN(customPrediction['prob.Spots>53']))) {
    return (
      <div className="predictions-generated">
        <div id="predictions-generated-title">
          <p>Model results were invalid, please try again</p>
        </div>
        {predictionDetails(false)}
      </div>
    );
  } else {
    return (
      <div className="predictions-generated">
        <div id="predictions-generated-title">
          <p>Input desired fields and press run to generate predictions</p>
        </div>
        {predictionDetails(false)}
      </div>
    );
  }
};

export default PlayWithModelOutputs;
