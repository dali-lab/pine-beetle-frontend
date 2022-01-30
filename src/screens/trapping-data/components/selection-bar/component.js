import React from 'react';

// import { TextInput, ChoiceInput, MultiSelectInput } from '../../../../components/input-components';
import { TextInput, MultiSelectInput } from '../../../../components/input-components';

import { DATA_MODES } from '../../../../constants';

import {
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from '../../../../utils';

import './style.scss';

const SelectionBar = (props) => {
  const {
    clearAllSelections,
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
    trappingData,
  } = props;

  const countyMode = dataMode === DATA_MODES.COUNTY;

  const allStates = [...new Set(trappingData.map(obj => obj.state))].sort();
  const allCounties = selectedState ? [...new Set(trappingData.map((obj => obj.county)))].sort() : [];
  const allRangerDistricts = selectedState ? [...new Set(trappingData.map((obj => obj.rangerDistrict)))].sort() : [];

  const statesMappedToNames = allStates.map(abbrev => getStateNameFromAbbreviation(abbrev)).filter(s => !!s);
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
        valueChildren={countyMode ? county : rangerDistrict}
        setValueParent={setStateAbbrev}
        setValueChildren={countyMode ? setCounty : setRangerDistrict}
        optionsParent={statesMappedToNames}
        optionsChildren={countyMode ? allCounties : allRangerDistricts}
      />
      {/* <div className="menuInstruction">
        <div>
          <ChoiceInput
            value={countyMode ? county : rangerDistrict}
            setValue={countyMode ? setCounty : setRangerDistrict}
            options={countyMode ? allCounties : allRangerDistricts}
            firstOptionText={countyMode ? 'County' : 'Ranger District'}
          />
        </div>
      </div> */}
      <button id="reset-current-data-button" className="animated-button" onClick={clearAllSelections} type="button">Clear</button>
    </div>
  );
};

export default SelectionBar;
