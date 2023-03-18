import React, { useState, useEffect } from 'react';

import {
  PlayWithModelInputs,
  PlayWithModelOutputs,
  OverviewText,
  SelectionBar,
} from './components';

import { DATA_MODES } from '../../constants';

import { api } from '../../services';

const PlayWithModel = (props) => {
  const {
    clearError, // function to clear the error
    county,
    dataMode,
    isError, // whether or not an error occurred
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
    const sublocation = dataMode === DATA_MODES.COUNTY ? 'county' : 'rangerDistrict';
    const selectedSubLocation = dataMode === DATA_MODES.COUNTY ? county : rangerDistrict;

    // sets input fields to 0 if selection cleared
    if (!selectedState && !sublocation) {
      setModelInputs({
        cleridst1: 0,
        endobrev: 0,
        spb: 0,
        spotst1: 0,
        spotst2: 0,
      });
    } else if (year && selectedState && selectedSubLocation) {
      // send request to backend to get model inputs for this selection
      const fetcher = dataMode === DATA_MODES.COUNTY ? api.getCountyData : api.getRangerDistrictData;

      fetcher({ year, state: selectedState, [sublocation]: selectedSubLocation })
        .then((data) => {
          const {
            spotst1 = 0,
            spotst2 = 0,
            spbPer2Weeks = 0,
            endobrev = 1,
            cleridst1,
          } = data[0] || {};

          // update the state
          updateModelInputs({
            spotst1,
            spotst2,
            spb: spbPer2Weeks,
            endobrev,
            cleridst1,
          });
        })
        .catch((error) => {
          console.log(error);
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
