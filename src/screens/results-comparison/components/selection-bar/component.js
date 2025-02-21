import React from 'react';

import { ChoiceInput, MultiSelectInput } from '../../../../components/input-components';

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
    selectedState,
    dataMode,
    county,
    rangerDistrict,
    setRangerDistrict,
    setPredictionYear,
    setCounty,
    setState,
    year,
  } = props;

  const statesMappedToNames = availableStates.map((abbrev) => getStateNameFromAbbreviation(abbrev)).filter((s) => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = (stateName) => setState(getStateAbbreviationFromStateName(stateName));
  const revYears = [...availableYears].reverse();

  return (
    <div className="container">
      <div id="resultsbar">
        <div className="resultsbar-selections">
          <div className="resultsbar-year-selection">
            <p className="resultsbar-year-selection-title">Year</p>
            <div className="resultsbar-year-selection-options input-container">
              <ChoiceInput setValue={setPredictionYear} options={revYears} value={year} />
            </div>
          </div>
          <div className="resultsbar-location-selection">
            <p className="resultsbar-location-selection-title">Locations</p>
            <MultiSelectInput
              valueParent={selectedStateName}
              valueChildren={dataMode === DATA_MODES.COUNTY ? county : rangerDistrict}
              setValueParent={setStateAbbrev}
              setValueChildren={dataMode === DATA_MODES.COUNTY ? setCounty : setRangerDistrict}
              optionsParent={statesMappedToNames}
              optionsChildren={availableSublocations}
            />
          </div>
          <button className="animated-button resultsbar-clear-button" onClick={clearAllSelections} type="button">Clear</button>
        </div>
      </div>
    </div>
  );
};

export default SelectionBar;
