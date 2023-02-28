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
    clearAllSelections,
    county,
    dataMode,
    rangerDistrict,
    selectedState,
    setCounty,
    setDataMode,
    setPredictionYear,
    setRangerDistrict,
    setState,
    year,
  } = props;

  const statesMappedToNames = availableStates.map((abbrev) => getStateNameFromAbbreviation(abbrev)).filter((s) => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = (stateName) => setState(getStateAbbreviationFromStateName(stateName));
  const revYears = [...availableYears].reverse();

  const countyMode = dataMode === DATA_MODES.COUNTY;

  return (
    <div id="predictionbar" className="container">
      <div className="predictionbar-year-selection">
        <p className="predictionbar-year-selection-title">Year</p>
        <div className="predictionbar-year-selection-options">
          <ChoiceInput setValue={setPredictionYear} value={year} options={revYears} firstOptionText="Year" />
        </div>
      </div>
      <div id="vl1" />
      <div className="predictionbar-year-selection">
        <p className="predictionbar-year-selection-title">State</p>
        <div className="predictionbar-year-selection-options">
          <ChoiceInput value={selectedStateName} setValue={setStateAbbrev} options={statesMappedToNames} firstOptionText="State" />
        </div>
      </div>
      <div id="vl1" />
      <div className="predictionbar-year-selection">
        <div id="mode-selection">
          <button
            type="button"
            id="mode-btn"
            onClick={() => { setDataMode(DATA_MODES.COUNTY); }}
            className={(countyMode) ? 'county-rd-selection' : null}
          >
            County
          </button>
          <div id="vl2" />
          <button
            type="button"
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
      <button
        type="button"
        id="reset-current-data-button"
        className="animated-button"
        onClick={clearAllSelections}
      >
        Clear
      </button>
    </div>
  );
};

export default SelectionBar;
