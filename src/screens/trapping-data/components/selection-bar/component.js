import React from 'react';

// import { TextInput, ChoiceInput, MultiSelectInput } from '../../../../components/input-components';
import { TextInput, MultiSelectInput } from '../../../../components/input-components';

import { DATA_MODES, allStates } from '../../../../constants';

import {
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from '../../../../utils';

import './style.scss';

const SelectionBar = (props) => {
  const {
    clearAllSelections,
    counties,
    countyData,
    dataMode,
    endYear,
    federalLands,
    federalLandData,
    selectedState,
    setCounties,
    setEndYear,
    setFederalLands,
    setStartYear,
    setState,
    startYear,
    // trappingData,
  } = props;

  const countyMode = dataMode === DATA_MODES.COUNTY;

  // const states = [...new Set(trappingData.map(obj => obj.state))].sort();
  // const allCounties = selectedState ? [...new Set(trappingData.map((obj => obj.county)))].sort() : [];
  // const allRangerDistricts = selectedState ? [...new Set(trappingData.map((obj => obj.rangerDistrict)))].sort() : [];

  // counties/FLs for the selected state (pass to Multi select child options to not lose them)
  const selectedCounties = selectedState ? [...new Set(countyData.filter(obj => obj.state === selectedState).map((obj => obj.county)))].sort() : [];
  const selectedFederalLand = selectedState ? [...new Set(federalLandData.filter(obj => obj.state === selectedState).map((obj => obj.rangerDistrict)))].sort() : [];

  // const statesMappedToNames = states.map(abbrev => getStateNameFromAbbreviation(abbrev)).filter(s => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));

  return (
    <div id="predictionbar-trapping" className="container">
      <div id="year-selection">
        <div id="start-year-selection"><TextInput instructions="Year" setValue={setStartYear} value={startYear} /></div>
        <div id="vl3" />
        {/* TODO: "to" */}
        <div id="end-year-selection"><TextInput setValue={setEndYear} value={endYear} /></div>
      </div>
      <MultiSelectInput
        title="Locations"
        type={countyMode ? 'Counties' : 'Federal land'}
        valueParent={selectedStateName}
        valueChildren={countyMode ? counties : federalLands}
        setValueParent={setStateAbbrev}
        setValueChildren={countyMode ? setCounties : setFederalLands}
        optionsParent={allStates}
        optionsChildren={countyMode ? selectedCounties : selectedFederalLand}
      />
      <button id="reset-current-data-button" className="animated-button" onClick={clearAllSelections} type="button">Clear</button>
    </div>
  );
};

export default SelectionBar;
