/* eslint-disable react/button-has-type */
import React from 'react';

import { ChoiceInput } from '../../../../components/input-components';

// import { DATA_MODES } from '../../../../constants';

import {
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from '../../../../utils';

import './style.scss';

const SelectionBar = (props) => {
  const {
    availableStates,
    availableYears,
    clearAllSelections,
    selectedState,
    setPredictionYear,
    setState,
    year,
  } = props;

  const statesMappedToNames = availableStates.map(abbrev => getStateNameFromAbbreviation(abbrev)).filter(s => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));

  // const countyMode = dataMode === DATA_MODES.COUNTY;

  return (
    <div>
      <div id="predictionbar" className="container">
        <ChoiceInput instructions="Year" setValue={setPredictionYear} options={availableYears} value={year} />
        <div id="vl1" />
        <ChoiceInput instructions="State" value={selectedStateName} setValue={setStateAbbrev} options={statesMappedToNames} firstOptionText="State" />
        <div id="vl1" />
        <button id="reset-current-data-button" className="animated-button" onClick={clearAllSelections}>Clear</button>
      </div>
    </div>
  );
};

export default SelectionBar;
