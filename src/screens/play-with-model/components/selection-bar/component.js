import React from 'react';

import { Button } from '../../../../components';
import { ChoiceInput } from '../../../../components/input-components';

import { DATA_MODES } from '../../../../constants';

import {
  getStateAbbreviationFromStateName,
  getStateNameFromAbbreviation,
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
    <div className="home-selection-bar-container">
      <div className="home-selection-bar-item">
        <div className="home-selection-bar-label-container">
          <div className="home-selection-bar-label">Year</div>
        </div>
        <div className="home-selection-bar-input-container">
          <ChoiceInput setValue={setPredictionYear} value={year} options={revYears} firstOptionText="Year" />
        </div>
      </div>
      <div className="home-selection-bar-item">
        <div className="home-selection-bar-label-container">
          <div className="home-selection-bar-label">State</div>
        </div>
        <div className="home-selection-bar-input-container">
          <ChoiceInput value={selectedStateName} setValue={setStateAbbrev} options={statesMappedToNames} firstOptionText="State" />
        </div>
      </div>
      <div className="home-selection-bar-item">
        <div className="home-selection-bar-label-container">
          <div
            className="home-selection-bar-label home-selection-bar-toggle-label"
            onClick={() => setDataMode(countyMode ? DATA_MODES.RANGER_DISTRICT : DATA_MODES.COUNTY)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setDataMode(countyMode ? DATA_MODES.RANGER_DISTRICT : DATA_MODES.COUNTY);
              }
            }}
          >
            {countyMode ? 'County' : 'Ranger District'}
          </div>
        </div>
        <div className="home-selection-bar-input-container">
          <ChoiceInput
            value={countyMode ? county : rangerDistrict}
            setValue={countyMode ? (v) => setCounty([v]) : (v) => setRangerDistrict([v])}
            options={availableSublocations}
            firstOptionText={countyMode ? 'County' : 'Ranger District'}
          />
        </div>
      </div>
      <Button
        className="home-selection-bar-clear-button"
        onClick={clearAllSelections}
      >
        Clear
      </Button>
    </div>
  );
};

export default SelectionBar;
