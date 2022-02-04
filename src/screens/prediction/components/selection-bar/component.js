/* eslint-disable react/button-has-type */
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
    clearAllSelections,
    county,
    dataMode,
    rangerDistrict,
    selectedState,
    setCounty,
    setDataMode,
    setRangerDistrict,
    setState,
    setYear,
    year,
  } = props;

  const statesMappedToNames = availableStates.map(abbrev => getStateNameFromAbbreviation(abbrev)).filter(s => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));

  const countyMode = dataMode === DATA_MODES.COUNTY;

  const [newYear, setNewYear] = useState(year);

  // immediately updates UI with new user selection, but doesn't update redux until 1s debounce
  const setYearDebounced = (yr) => {
    setNewYear(yr);

    if (yr.toString().length === 4) {
      debounce(setYear, 1000)(yr);
    }
  };

  useEffect(() => {
    setNewYear(year);
  }, [year]);

  return (
    <div id="predictionbar" className="container">
      <TextInput instructions="Year" setValue={setYearDebounced} value={newYear} />
      <div id="vl1" />
      <ChoiceInput instructions="State" value={selectedStateName} setValue={setStateAbbrev} options={statesMappedToNames} firstOptionText="State" />
      <div id="vl1" />
      <div className="menuInstruction">
        <div id="mode-selection">
          <button
            id="mode-btn"
            onClick={() => { setDataMode(DATA_MODES.COUNTY); }}
            className={(countyMode) ? 'county-rd-selection' : null}
          >
            County
          </button>
          <div id="vl2" />
          <button
            id="mode-btn"
            onClick={() => { setDataMode(DATA_MODES.RANGER_DISTRICT); }}
            className={(!countyMode) ? 'county-rd-selection' : null}
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
      <button id="reset-current-data-button" className="animated-button" onClick={clearAllSelections}>Clear</button>
    </div>
  );
};

export default SelectionBar;
