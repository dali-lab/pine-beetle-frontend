/* eslint-disable react/button-has-type */
import React from 'react';

import { ChoiceInput, MultiSelectInput } from '../../../../components/input-components';

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
    clearAllSelections,
    county,
    dataMode,
    rangerDistrict,
    selectedState,
    setCounty,
    // setDataMode,
    setPredictionYear,
    setRangerDistrict,
    setState,
    year,
  } = props;

  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));

  const countyMode = dataMode === DATA_MODES.COUNTY;

  return (
    <div id="predictionbar" className="container">
      <div className="predictionbar-year-selection">
        <p className="predictionbar-year-selection-title">Year</p>
        <div className="predictionbar-year-selection-options">
          <ChoiceInput setValue={setPredictionYear} options={availableYears} value={year} />
        </div>
      </div>
      <div className="predictionbar-location-selection">
        <p className="predictionbar-location-selection-title">Locations</p>
        <MultiSelectInput
          valueParent={selectedStateName}
          valueChildren={countyMode ? county : rangerDistrict}
          setValueParent={setStateAbbrev}
          setValueChildren={countyMode ? setCounty : setRangerDistrict}
          optionsParent={allStates}
          optionsChildren={availableSublocations}
        />
      </div>
      <button className="predictionbar-clear-button" onClick={clearAllSelections} type="button">Clear</button>
    </div>
  );
};

export default SelectionBar;
