import React, { useState, useEffect } from 'react';

import {
  PlayWithModelInputs,
  PlayWithModelOutputs,
  OverviewText,
  SelectionBar,
} from './components';

import { Loading } from '../../../../components';

import { DATA_MODES } from '../../../../constants';

export const DEFAULT_MODEL_VERSION = 2024;

const PlayWithModel = (props) => {
  const {
    clearAllSelections,
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

  useEffect(() => {
    clearAllSelections(); // clears selections initially when switching to this tab
  }, [clearAllSelections]);

  const [modelInputs, setModelInputs] = useState({
    cleridst1: null,
    endobrev: 1,
    spb: 0,
    spotst1: 0,
    spotst2: 0,
    modelVersion: DEFAULT_MODEL_VERSION,
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
    runCustomPrediction(
      modelInputs.cleridst1,
      modelInputs.spotst1,
      modelInputs.spotst2,
      modelInputs.spb,
      modelInputs.endobrev,
      modelInputs.modelVersion,
    );
  };

  useEffect(() => {
    // don't run if no predictions
    if (predictions.length === 0) return;

    const selectedSubLocation = dataMode === DATA_MODES.COUNTY ? county : rangerDistrict;

    // sets input fields to 0 if selections not fully specified
    if (!selectedState || selectedSubLocation.length !== 1) {
      setModelInputs({
        cleridst1: null,
        endobrev: 1,
        spb: 0,
        spotst1: 0,
        spotst2: 0,
        modelVersion: DEFAULT_MODEL_VERSION,
      });
    } else {
      const {
        spotst1,
        spotst2,
        spbPer2Weeks,
        endobrev,
        cleridst1,
        modelVersion,
      } = predictions[0];

      // update the state
      updateModelInputs({
        spotst1,
        spotst2,
        spb: spbPer2Weeks,
        endobrev,
        cleridst1,
        modelVersion,
      });
    }
  }, [county, dataMode, predictions, rangerDistrict, selectedState]);

  return (
    <div className="page-container">
      <Loading visible={isLoading} />
      {fetchErrorText.length > 0 && fetchErrorText.map((t) => <p>{t}</p>)}
      <OverviewText />
      <SelectionBar />
      <div className="play-with-model-inputs-container">
        <PlayWithModelInputs
          modelInputs={modelInputs}
          runModel={runModel}
          updateModelInputs={updateModelInputs}
          defaultModelVersion={DEFAULT_MODEL_VERSION}
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
