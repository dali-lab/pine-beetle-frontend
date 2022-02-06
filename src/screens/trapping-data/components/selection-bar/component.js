import React from 'react';

import { ChoiceInput } from '../../../../components/input-components';

import { DATA_MODES, getYearRange } from '../../../../constants';

import {
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from '../../../../utils';

import './style.scss';

const SelectionBar = (props) => {
  const {
    clearAllSelections,
    county,
    dataMode,
    year,
    rangerDistrict,
    selectedState,
    setCounty,
    setDataMode,
    setEndYear,
    setRangerDistrict,
    setStartYear,
    setState,
    trappingData,
  } = props;

  // const yearOptions = () => {
  //   const max = year;
  //   const min = 1988;
  //   const years = [];

  //   for (let i = max; i >= min; i -= 1) {
  //     years.push(i);
  //   }
  //   return years;
  // };

  const countyMode = dataMode === DATA_MODES.COUNTY;

  const allStates = [...new Set(trappingData.map(obj => obj.state))].sort();
  const allCounties = selectedState ? [...new Set(trappingData.map((obj => obj.county)))].sort() : [];
  const allRangerDistricts = selectedState ? [...new Set(trappingData.map((obj => obj.rangerDistrict)))].sort() : [];

  const statesMappedToNames = allStates.map(abbrev => getStateNameFromAbbreviation(abbrev)).filter(s => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));


  return (
    <div id="predictionbar-trapping" className="container">
      <div id="year-selection">
        <div id="start-year-selection"><ChoiceInput instructions="Year" setValue={setStartYear} options={getYearRange(1988, year)} /></div>
        <div id="vl3" />
        {/* TODO: "to" */}
        <div id="end-year-selection"><ChoiceInput setValue={setEndYear} options={getYearRange(1988, year)} /></div>
      </div>
      <div id="vl1" />
      <ChoiceInput instructions="Select State" value={selectedStateName} setValue={setStateAbbrev} options={statesMappedToNames} firstOptionText="State" />
      <div id="vl1" />
      <div className="menuInstruction">
        <div id="mode-selection">
          <button
            id="mode-btn"
            onClick={() => { setDataMode(DATA_MODES.COUNTY); }}
            className={(countyMode) ? 'county-rd-selection' : null}
            type="button"
          >
            County
          </button>
          <div id="vl2" />
          <button
            id="mode-btn"
            onClick={() => { setDataMode(DATA_MODES.RANGER_DISTRICT); }}
            className={(!countyMode) ? 'county-rd-selection' : null}
            type="button"
          >
            <span className="full-text">Ranger District</span>
            <span className="short-text">RD</span>
          </button>
        </div>
        <div>
          <ChoiceInput
            value={countyMode ? county : rangerDistrict}
            setValue={countyMode ? setCounty : setRangerDistrict}
            options={countyMode ? allCounties : allRangerDistricts}
            firstOptionText={countyMode ? 'County' : 'Ranger District'}
          />
        </div>
      </div>
      <button id="reset-current-data-button" className="animated-button" onClick={clearAllSelections} type="button">Clear</button>
    </div>
  );
};

export default SelectionBar;
