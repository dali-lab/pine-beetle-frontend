/* eslint-disable react/button-has-type */
import React from 'react';

import { ChoiceInput } from '../../../../components/input-components';

import { CHART_MODES } from '../../../../constants';

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
    startYear,
    setStartYear,
    // setEndYear,
    // endYear,
    year,
    chartMode,
  } = props;

  const statesMappedToNames = availableStates.map(abbrev => getStateNameFromAbbreviation(abbrev)).filter(s => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));
  const isGraphView = chartMode === CHART_MODES.GRAPH;

  if (isGraphView) {
    return (
      <div>
        <div id="predictionbar" className="container">
          <div id="year-selection">
            <div id="start-year-selection"><ChoiceInput instructions="Start Year" setValue={setStartYear} options={availableYears} value={startYear} /></div>
            <div id="vl3" />
            <div id="end-year-selection"><ChoiceInput instructions="End Year" setValue={setPredictionYear} options={availableYears} value={year} /></div>
          </div>
          <ChoiceInput instructions="State" value={selectedStateName} setValue={setStateAbbrev} options={statesMappedToNames} firstOptionText="State" />
          <div id="vl1" />
          <button id="reset-current-data-button" className="animated-button" onClick={clearAllSelections}>Clear</button>
        </div>
      </div>
    );
  } else {
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
  }
};

export default SelectionBar;
