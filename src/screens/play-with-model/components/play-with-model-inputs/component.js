import React from 'react';

import './style.scss';

import InputContainer from '../input-container';

const PlayWithModelInputs = (props) => {
  const {
    modelInputs,
    runModel,
    setModelInputs,
  } = props;

  return (
    <div className="container" id="play-with-model-inputs-container">
      <InputContainer
        modelInputs={modelInputs}
        runModel={runModel}
        setModelInputs={setModelInputs}
      />
      <div id="vl" />
      <div className="predictions-generated">
        <div id="predictions-generated-title">
          Predicted beetle risks in 2020
        </div>
        {/* TODO: dynamically render data */}
        <div id="prob-spots">
          <div id="percent">
            10.2%
          </div>
          <div id="prob-text">
            Predicted % Chance of Any Spots ({'>'}0 spots)
          </div>
        </div>
        <div id="prob-outbreak">
          <div id="percent">
            0.2%
          </div>
          <div id="prob-text">
            Predicted % Chance of Outbreak ({'>'}50 spots)
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayWithModelInputs;
