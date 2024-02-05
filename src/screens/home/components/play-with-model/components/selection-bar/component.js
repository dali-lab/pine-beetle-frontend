import React from 'react';

import { ChoiceInput } from '../../../../../../components/input-components';
import { Button } from '../../../../../../components';

import { DATA_MODES } from '../../../../../../constants';

import {
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from '../../../../../../utils';

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
    <div className="play-with-model-bar">
      <div className="play-with-model-bar-selection">
        <p className="play-with-model-bar-selection-title">Year</p>
        <div className="play-with-model-bar-selection-options">
          <ChoiceInput setValue={setPredictionYear} value={year} options={revYears} firstOptionText="Year" />
        </div>
      </div>
      <div className="play-with-model-bar-selection">
        <p className="play-with-model-bar-selection-title">State</p>
        <div className="play-with-model-bar-selection-options">
          <ChoiceInput value={selectedStateName} setValue={setStateAbbrev} options={statesMappedToNames} firstOptionText="State" />
        </div>
      </div>
      <div className="play-with-model-bar-selection">
        <div id="mode-selection">
          <button
            type="button"
            id="mode-btn"
            onClick={() => { setDataMode(DATA_MODES.COUNTY); }}
            className={(countyMode) ? 'county-rd-selection' : null}
          >
            County
          </button>
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
            setValue={countyMode ? (v) => setCounty([v]) : (v) => setRangerDistrict([v])}
            options={availableSublocations}
            firstOptionText={countyMode ? 'County' : 'Ranger District'}
          />
        </div>
      </div>
      <Button
        className="reset-current-data-button"
        onClick={clearAllSelections}
      >
        Clear
      </Button>
    </div>
  );
};

export default SelectionBar;
