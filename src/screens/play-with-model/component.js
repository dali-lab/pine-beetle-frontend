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
      <PlayWithModelInputs
        modelInputs={modelInputs}
        runModel={runModel}
        setModelInputs={updateModelInputs}
      />
    </div>
  );
};

export default PlayWithModel;
