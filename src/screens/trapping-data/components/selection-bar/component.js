import React from 'react';

import { ChoiceInput } from '../../../../components/input-components';

import { DATA_MODES } from '../../../../constants';

import {
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from '../../../../utils';

import './style.scss';

const SelectionBar = (props) => {
  const {
    availableStates,
    availableSublocations,
    availableYears,
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

  return (
    <div id="predictionbar-trapping" className="container">
      <div id="year-selection">
        <div id="start-year-selection"><ChoiceInput instructions="End Year" setValue={setStartYear} options={availableYears} value={startYear} /></div>
        <div id="vl3" />
        {/* TODO: "to" */}
        <div id="end-year-selection"><ChoiceInput instructions="Start Year" setValue={setEndYear} options={availableYears} value={endYear} /></div>
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
