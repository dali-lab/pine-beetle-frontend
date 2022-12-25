import React from 'react';

import { MultiSelectInput, ChoiceInput } from '../../../../components/input-components';

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
    setEndYear,
    setRangerDistrict,
    setStartYear,
    setState,
    startYear,
  } = props;

  const statesMappedToNames = availableStates.map((abbrev) => getStateNameFromAbbreviation(abbrev)).filter((s) => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = (stateName) => setState(getStateAbbreviationFromStateName(stateName));
  const revYears = [...availableYears].reverse();

  return (
    <div id="historicalbar" className="container">
      <div className="historicalbar-year-selection">
        <p className="historicalbar-year-selection-title">Year range</p>
        <div className="historicalbar-year-selection-options">
          <ChoiceInput setValue={setStartYear} options={availableYears} value={startYear} firstOptionText="Year" />
          <ChoiceInput setValue={setEndYear} options={revYears} value={endYear} />
        </div>
      </div>
      <div className="historicalbar-location-selection">
        <p className="historicalbar-location-selection-title">Locations</p>
        <MultiSelectInput
          valueParent={selectedStateName}
          valueChildren={dataMode === DATA_MODES.COUNTY ? county : rangerDistrict}
          setValueParent={setStateAbbrev}
          setValueChildren={dataMode === DATA_MODES.COUNTY ? setCounty : setRangerDistrict}
          optionsParent={statesMappedToNames}
          optionsChildren={availableSublocations}
        />
      </div>
      <button className="historicalbar-clear-button" onClick={clearSelections} type="button">Clear</button>
    </div>
  );
};

export default SelectionBar;
