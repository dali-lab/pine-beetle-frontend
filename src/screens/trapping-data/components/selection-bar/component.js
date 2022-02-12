import React from 'react';

import { MultiSelectInput, ChoiceInput } from '../../../../components/input-components';

import { DATA_MODES, allStates } from '../../../../constants';

import {
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from '../../../../utils';

import './style.scss';

const SelectionBar = (props) => {
  const {
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

  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));

  return (
    <div id="historicalbar" className="container">
      <div className="historicalbar-year-selection">
        <p className="historicalbar-year-selection-title">Year range</p>
        <div className="historicalbar-year-selection-options">
          <ChoiceInput setValue={setStartYear} options={availableYears} value={startYear} />
          <ChoiceInput setValue={setEndYear} options={availableYears} value={endYear} />
        </div>
      </div>
      <div className="historicalbar-location-selection">
        <p className="historicalbar-location-selection-title">Locations</p>
        <MultiSelectInput
          valueParent={selectedStateName}
          valueChildren={dataMode === DATA_MODES.COUNTY ? county : rangerDistrict}
          setValueParent={setStateAbbrev}
          setValueChildren={dataMode === DATA_MODES.COUNTY ? setCounty : setRangerDistrict}
          optionsParent={allStates}
          optionsChildren={availableSublocations}
        />
      </div>
      <button className="historicalbar-clear-button" onClick={clearSelections} type="button">Clear</button>
    </div>
  );
};

export default SelectionBar;
