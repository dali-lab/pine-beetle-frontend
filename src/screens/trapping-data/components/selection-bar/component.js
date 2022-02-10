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
    <div id="predictionbar-trapping" className="container">
      <div id="year-selection">
        <div id="start-year-selection"><ChoiceInput instructions="Start Year" setValue={setStartYear} options={availableYears} value={startYear} /></div>
        <div id="vl3" />
        {/* TODO: "to" */}
        <div id="end-year-selection"><ChoiceInput instructions="End Year" setValue={setEndYear} options={availableYears} value={endYear} /></div>
      </div>
      <MultiSelectInput
        title="Locations"
        type={countyMode ? 'Counties' : 'Federal land'}
        valueParent={selectedStateName}
        valueChildren={countyMode ? county : rangerDistrict}
        setValueParent={setStateAbbrev}
        setValueChildren={countyMode ? setCounty : setRangerDistrict}
        optionsParent={allStates}
        optionsChildren={availableSublocations}
      />
      <button id="reset-current-data-button" className="animated-button" onClick={clearSelections} type="button">Clear</button>
    </div>
  );
};

export default SelectionBar;
