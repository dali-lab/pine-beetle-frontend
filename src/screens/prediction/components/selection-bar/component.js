import React from 'react';

import { ChoiceInput, MultiSelectInput } from '../../../../components/input-components';

import { CHART_MODES, DATA_MODES } from '../../../../constants';

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
    startYear,
    setStartYear,
    year,
    chartMode,
  } = props;

  const statesMappedToNames = availableStates.map((abbrev) => getStateNameFromAbbreviation(abbrev)).filter((s) => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = (stateName) => setState(getStateAbbreviationFromStateName(stateName));
  const isGraphView = chartMode === CHART_MODES.GRAPH;
  const revYears = [...availableYears].reverse();

  if (isGraphView) {
    return (
      <div>
        <div id="predictionbar" className="container">
          <div className="predictionbar-year-selection">
            <p className="predictionbar-year-selection-title">Years</p>
            <div className="predictionbar-year-selection-options">
              <ChoiceInput
                instructions="Start Year"
                setValue={setStartYear}
                options={availableYears}
                value={startYear}
                firstOptionText="Year"
              />
              <ChoiceInput
                instructions="End Year"
                setValue={setPredictionYear}
                options={availableYears}
                value={year}
                firstOptionText="Year"
              />
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
          <button
            type="button"
            className="predictionbar-clear-button"
            onClick={clearAllSelections}
          >
            Clear
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div id="predictionbar" className="container">
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
          <button className="predictionbar-clear-button" onClick={clearAllSelections} type="button">Clear</button>
        </div>
      </div>
    );
  }
};

export default SelectionBar;
