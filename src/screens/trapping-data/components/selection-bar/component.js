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

  const countyMode = dataMode === DATA_MODES.COUNTY;

  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));

  return (
    <div className="container">
      <div className="trapbar-container">
        <div className="trapbar-year-selection">
          <p className="trapbar-year-selection-title">Year range</p>
          <div className="trapbar-year-selection-options">
            <ChoiceInput setValue={setStartYear} options={availableYears} value={startYear} />
            <ChoiceInput setValue={setEndYear} options={availableYears} value={endYear} />
          </div>
        </div>
        <div className="trapbar-location-selection">
          <p className="trapbar-location-selection-title">Locations</p>
          <MultiSelectInput
            valueParent={selectedStateName}
            valueChildren={countyMode ? county : rangerDistrict}
            setValueParent={setStateAbbrev}
            setValueChildren={countyMode ? setCounty : setRangerDistrict}
            optionsParent={allStates}
            optionsChildren={availableSublocations}
          />
        </div>
        <button className="trapbar-clear-button" onClick={clearSelections} type="button">Clear</button>
      </div>
    </div>
  );
};

export default SelectionBar;
