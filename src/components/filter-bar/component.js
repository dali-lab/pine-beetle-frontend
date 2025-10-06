import React from 'react';

import { DATA_MODES } from '../../constants';
import {
  getStateAbbreviationFromStateName,
  getStateNameFromAbbreviation,
} from '../../utils';
import { ChoiceInput, MultiSelectInput } from '../input-components';

import './style.scss';

const FilterBar = (props) => {
  const {
    availableStates,
    availableYears,
    availableSublocations,
    county,
    dataMode,
    predictionYear,
    rangerDistrict,
    selectedState,
    setCounty,
    setPredictionYear,
    setRangerDistrict,
    setState,
    clearAllSelections,
  } = props;

  const statesMappedToNames = availableStates.map((abbrev) => getStateNameFromAbbreviation(abbrev)).filter((s) => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = (stateName) => setState(getStateAbbreviationFromStateName(stateName));

  const revYears = [...availableYears].reverse();

  return (
    <div className="filter-bar">
      <div className="filter-bar-container">
        {/* Year Selection */}
        <div className="filter-section">
          <div className="filter-label">Year</div>
          <div className="filter-input">
            <ChoiceInput setValue={setPredictionYear} options={revYears} value={predictionYear} />
          </div>
        </div>

        <div className="filter-divider" />

        {/* State Selection */}
        <div className="filter-section">
          <div className="filter-label">State</div>
          <div className="filter-input">
            <MultiSelectInput
              valueParent={selectedStateName}
              valueChildren={dataMode === DATA_MODES.COUNTY ? county : rangerDistrict}
              setValueParent={setStateAbbrev}
              setValueChildren={dataMode === DATA_MODES.COUNTY ? setCounty : setRangerDistrict}
              optionsParent={statesMappedToNames}
              optionsChildren={availableSublocations}
            />
          </div>
        </div>

        <div className="filter-divider" />

        {/* Clear Button */}
        <div className="filter-actions">
          <button
            className="action-button clear-button"
            onClick={clearAllSelections}
            type="button"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
