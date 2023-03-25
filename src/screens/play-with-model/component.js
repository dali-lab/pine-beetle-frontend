import React, { useState, useEffect } from 'react';

import {
  PlayWithModelInputs,
  PlayWithModelOutputs,
  OverviewText,
  SelectionBar,
} from './components';

import { Loading } from '../../components';

import { DATA_MODES } from '../../constants';

const PlayWithModel = (props) => {
  const {
    clearError, // function to clear the error
    fetchErrorText,
    isLoading,
    county,
    dataMode,
    isError, // whether or not an error occurred
    predictions,
    rangerDistrict,
    runCustomPrediction, // function to call for running the prediction
    selectedState,
    year,
  } = props;

  const [modelInputs, setModelInputs] = useState({
    cleridst1: 0,
    endobrev: 0,
    spb: 0,
    spotst1: 0,
    spotst2: 0,
  });

  const updateModelInputs = (updates) => {
    setModelInputs((currentInputs) => ({
      ...currentInputs,
      ...updates,
    }));
  };

  const runModel = () => {
    if (isError) {
      clearError();
    }
    runCustomPrediction(modelInputs.cleridst1, modelInputs.spotst1, modelInputs.spotst2, modelInputs.spb, modelInputs.endobrev);
  };

  useEffect(() => {
    const selectedSubLocation = dataMode === DATA_MODES.COUNTY ? county : rangerDistrict;

    // sets input fields to 0 if selections not fully specified
    if (predictions.length !== 1 || !selectedState || selectedSubLocation.length !== 1) {
      setModelInputs({
        cleridst1: 0,
        endobrev: 0,
        spb: 0,
        spotst1: 0,
        spotst2: 0,
      });
    } else {
      const {
        spotst1 = 0,
        spotst2 = 0,
        spbPer2Weeks = 0,
        endobrev = 1,
        cleridst1,
      } = predictions[0];

      // update the state
      updateModelInputs({
        spotst1,
        spotst2,
        spb: spbPer2Weeks,
        endobrev,
        cleridst1,
      });
    }
  }, [county, dataMode, predictions, rangerDistrict, selectedState]);

  return (
    <div>
      <Loading visible={isLoading} />
      {fetchErrorText.length > 0 && fetchErrorText.map((t) => <p>{t}</p>)}
      <OverviewText />
      <SelectionBar />
      <div className="container" id="play-with-model-inputs-container">
        <PlayWithModelInputs
          modelInputs={modelInputs}
          runModel={runModel}
          updateModelInputs={updateModelInputs}
        />
        <PlayWithModelOutputs
          county={county}
          dataMode={dataMode}
          rangerDistrict={rangerDistrict}
          selectedState={selectedState}
          year={year}
        />
      </div>
    </div>
  );
};

export default PlayWithModel;
