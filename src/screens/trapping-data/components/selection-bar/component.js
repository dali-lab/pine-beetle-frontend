import React, { useEffect } from 'react';

import { MultiSelectInput, ChoiceInput } from '../../../../components/input-components';

import { CHART_MODES, DATA_MODES } from '../../../../constants';

import {
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from '../../../../utils';

import './style.scss';

const SelectionBar = (props) => {
  const {
    availableStates,
    availableSublocations,
    availableYears,
    chartMode,
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

  const statesMappedToNames = availableStates.map((abbrev) => getStateNameFromAbbreviation(abbrev)).filter((s) => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = (stateName) => setState(getStateAbbreviationFromStateName(stateName));
  const revYears = [...availableYears].reverse();

  useEffect(() => {
    // handle desync issues
    if (chartMode === CHART_MODES.MAP && startYear !== endYear) {
      setStartYear(endYear);
    }
  }, [chartMode, endYear, setStartYear, startYear]);

  const yearRangeSelector = (
    <div className="historicalbar-year-selection">
      <p className="historicalbar-year-selection-title">Year range</p>
      <div className="historicalbar-year-selection-options">
        <ChoiceInput setValue={setStartYear} options={availableYears} value={startYear} firstOptionText="Year" />
        <ChoiceInput setValue={setEndYear} options={revYears} value={endYear} />
      </div>
    </div>
  );

  const setBothYears = (year) => {
    // let the useEffect handle the weird reset edge case
    if (year !== '') setStartYear(year);
    setEndYear(year);
  };

  const singleYearSelector = (
    <div className="historicalbar-year-selection">
      <p className="historicalbar-year-selection-title">Year</p>
      <div className="historicalbar-year-selection-options">
        <ChoiceInput setValue={setBothYears} options={revYears} value={endYear} />
      </div>
    </div>
  );

  return (
    <div id="historicalbar" className="container">
      {chartMode === CHART_MODES.MAP
        ? singleYearSelector
        : yearRangeSelector}
      <div className="historicalbar-location-selection">
        <p className="historicalbar-location-selection-title">Locations</p>
        <MultiSelectInput
          valueParent={selectedStateName}
          valueChildren={dataMode === DATA_MODES.COUNTY ? county : rangerDistrict}
          setValueParent={setStateAbbrev}
          setValueChildren={dataMode === DATA_MODES.COUNTY ? setCounty : setRangerDistrict}
          optionsParent={statesMappedToNames}
          optionsChildren={availableSublocations}
        />
      </div>
      <button className="animated-button historicalbar-clear-button" onClick={clearSelections} type="button">Clear</button>
    </div>
  );
};

export default SelectionBar;
