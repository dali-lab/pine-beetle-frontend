import React, { useState, useEffect } from 'react';

import {
  PlayWithModelInputs,
  PlayWithModelOutputs,
  OverviewText,
  SelectionBar,
} from './components';

import { DATA_MODES } from '../../constants';

const PlayWithModel = (props) => {
  const {
    clearError, // function to clear the error
    county,
    countyTrappingsData,
    dataMode,
    isError, // whether or not an error occurred
    rangerDistrict,
    rangerDistrictTrappingsData,
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
    setModelInputs(currentInputs => ({
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
    const sublocation = dataMode === DATA_MODES.COUNTY ? county : rangerDistrict;
    const dataArray = dataMode === DATA_MODES.COUNTY ? countyTrappingsData : rangerDistrictTrappingsData;

    // sets input fields to 0 if selection cleared
    if (!selectedState && !sublocation) {
      setModelInputs({
        cleridst1: 0,
        endobrev: 0,
        spb: 0,
        spotst1: 0,
        spotst2: 0,
      });
    } else if (year && selectedState && sublocation) {
      // filter to find relevant data fields
      const relevantData = dataArray
        .filter(obj => (
          obj.state === selectedState
          && ((dataMode === DATA_MODES.COUNTY && obj.county === county)
            || (dataMode === DATA_MODES.RANGER_DISTRICT && obj.rangerDistrict === rangerDistrict))
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
        spotst1: (spotst1 || 0),
        spotst2: (spotst2 || 0),
        spb: (spbPer2Weeks || 0),
        endobrev: (endobrev || 0),
        cleridst1: (cleridPer2Weeks || 0),
      });
    }
  }, [year, selectedState, county, rangerDistrict, dataMode]);

  return (
    <div>
      <OverviewText />
      <SelectionBar />
      <div className="container" id="play-with-model-inputs-container">
        <PlayWithModelInputs
          modelInputs={modelInputs}
          runModel={runModel}
          updateModelInputs={updateModelInputs}
        />
        <PlayWithModelOutputs />
      </div>
    </div>
  );
};

export default PlayWithModel;
