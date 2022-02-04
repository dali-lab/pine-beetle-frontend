import React, { useState, useEffect } from 'react';
import { debounce } from 'debounce';

import { TextInput, ChoiceInput } from '../../../../components/input-components';

import { DATA_MODES } from '../../../../constants';

import {
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from '../../../../utils';

import './style.scss';

const SelectionBar = (props) => {
  const {
    // availableYears,
    availableStates,
    availableSublocations,
    clearSelections,
    county,
    dataMode,
    endYear,
    rangerDistrict,
    selectedState,
    setCounty,
    setDataMode,
    setEndYear,
    setRangerDistrict,
    setStartYear,
    setState,
    startYear,
  } = props;

  const countyMode = dataMode === DATA_MODES.COUNTY;

  const statesMappedToNames = availableStates.map(abbrev => getStateNameFromAbbreviation(abbrev)).filter(s => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));

  const [newStartYear, setNewStartYear] = useState(startYear);
  const [newEndYear, setNewEndYear] = useState(endYear);

  // immediately updates UI with new user selection, but doesn't update redux until 1s debounce
  const setStartYearDebounced = (year) => {
    setNewStartYear(year);

    if (year.toString().length === 4) {
      debounce(setStartYear, 1000)(year);
    }
  };

  // immediately updates UI with new user selection, but doesn't update redux until 1s debounce
  const setEndYearDebounced = (year) => {
    setNewEndYear(year);

    if (year.toString().length === 4) {
      debounce(setEndYear, 1000)(year);
    }
  };

  useEffect(() => {
    setNewStartYear(startYear);
    setNewEndYear(endYear);
  }, [startYear, endYear]);

  return (
    <div id="predictionbar-trapping" className="container">
      <div id="year-selection">
        <div id="start-year-selection"><TextInput instructions="Year" setValue={setStartYearDebounced} value={newStartYear} /></div>
        <div id="vl3" />
        {/* TODO: "to" */}
        <div id="end-year-selection"><TextInput setValue={setEndYearDebounced} value={newEndYear} /></div>
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
            options={availableSublocations}
            firstOptionText={countyMode ? 'County' : 'Ranger District'}
          />
        </div>
      </div>
      <button id="reset-current-data-button" className="animated-button" onClick={clearSelections} type="button">Clear</button>
    </div>
  );
};

export default SelectionBar;
