import React, { useState, useEffect } from 'react';

import {
  PlayWithModelInputs,
  OverviewText,
  SelectionBar,
} from './components';

const PlayWithModel = (props) => {
  const {
    countyTrappingsData,
    // rangerDistrictTrappingsData,
    year,
    selectedState,
    county,
    //   clearError, // function to clear the error
  //   customPrediction, // result of prediction output
  //   error, // error object if one occurred
  //   isError, // whether or not an error occurred
  //   isLoading, // whether or not we are loading (i.e. running the model)
  //   runCustomPrediction, // function to call for running the prediction
  } = props;

  const [modelInputs, setModelInputs] = useState({
    cleridst1: 0,
    endobrev: 0,
    spb: 0,
    spotst1: 0,
    spotst2: 0,
  });

  const updateModelInputs = (updates) => {
    setModelInputs(currentInputs => ({
      ...currentInputs,
      ...updates,
    }));
  };

  const runModel = () => {
    console.log(modelInputs);
  };

  useEffect(() => {
    if (year && selectedState && county) {
      // filter to find relevant data fields
      const relevantData = countyTrappingsData
        .filter(obj => (
          obj.state === selectedState
          && obj.county === county
          && (obj.year === year || obj.year === year - 1)
        ));

      // grab current and previous year objects
      const currentYearObject = relevantData.find(obj => obj.year === year) || {};
      const previousYearObject = relevantData.find(obj => obj.year === year - 1) || {};

      // grab the model input values for this selection
      const {
        spotst1,
        spotst2,
        spbPer2Weeks,
        endobrev,
      } = currentYearObject;

      const {
        cleridPer2Weeks,
      } = previousYearObject;

      // update the state
      updateModelInputs({
        spotst1,
        spotst2,
        spb: spbPer2Weeks,
        endobrev,
        cleridst1: cleridPer2Weeks,
      });
    }
  }, [year, selectedState, county]);

  return (
    <div>
      <OverviewText />
      <SelectionBar />
      <div className="container" id="play-with-model-inputs-container">
        <PlayWithModelInputs
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
    </div>
  );
};

export default PlayWithModel;
