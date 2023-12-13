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
    availableYears,
    availableSublocations,
    clearAllSelections,
    selectedState,
    dataMode,
    county,
    rangerDistrict,
    setRangerDistrict,
    setCounty,
    setPredictionYear,
    setState,
    year,
  } = props;

  const statesMappedToNames = availableStates.map((abbrev) => getStateNameFromAbbreviation(abbrev)).filter((s) => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = (stateName) => setState(getStateAbbreviationFromStateName(stateName));
  const revYears = [...availableYears].reverse();

  return (
    <div className="container">
      <div id="predictionbar">
        <div className="predictionbar-year-selection">
          <p className="predictionbar-year-selection-title">Year</p>
          <div className="predictionbar-year-selection-options">
            <ChoiceInput setValue={setPredictionYear} options={revYears} value={year} />
          </div>
        </div>
        <div className="predictionbar-location-selection">
          <p className="predictionbar-location-selection-title">Locations</p>
          <MultiSelectInput
            valueParent={selectedStateName}
            valueChildren={dataMode === DATA_MODES.COUNTY ? county : rangerDistrict}
            setValueParent={setStateAbbrev}
            setValueChildren={dataMode === DATA_MODES.COUNTY ? setCounty : setRangerDistrict}
            optionsParent={statesMappedToNames}
            optionsChildren={availableSublocations}
          />
        </div>
        <button className="animated-button predictionbar-clear-button" onClick={clearAllSelections} type="button">Clear</button>
      </div>
    </div>
  );
};

export default SelectionBar;
