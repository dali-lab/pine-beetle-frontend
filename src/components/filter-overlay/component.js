import React, { useState } from 'react';
import { DATA_MODES } from '../../constants';
import {
  getStateAbbreviationFromStateName,
  getStateNameFromAbbreviation,
} from '../../utils';
import { ChoiceInput, MultiSelectInput } from '../input-components';
import './style.scss';

const FilterOverlay = (props) => {
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
    title = 'Filters',
    className = '',
  } = props;

  const [showFilters, setShowFilters] = useState(false);

  // Logic to map state abbreviations to full names
  const statesMappedToNames = availableStates.map((abbrev) => getStateNameFromAbbreviation(abbrev)).filter((s) => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = (stateName) => setState(getStateAbbreviationFromStateName(stateName));

  const revYears = [...availableYears].reverse();

  // Check for any active filters
  const hasActiveFilters = predictionYear || selectedStateName || county?.length > 0 || rangerDistrict?.length > 0;

  if (!showFilters) {
    return (
      <button
        type="button"
        onClick={() => setShowFilters(true)}
        className={`filter-toggle-button ${className}`}
      >
        <span className="filter-icon">⚙</span>
        Show Filters
        {hasActiveFilters && <span className="active-indicator">●</span>}
      </button>
    );
  }

  return (
    <div className={`filter-overlay ${className}`}>
      <div className="filter-header">
        <h3 className="filter-title">{title}</h3>
        <button
          type="button"
          onClick={() => setShowFilters(false)}
          className="filter-close-button"
        >
          ×
        </button>
      </div>
      <div className="filter-content">
        {/* Year Selection */}
        <div className="filter-section">
          <div className="filter-label">Year</div>
          <div className="filter-input">
            <ChoiceInput
              id="year-input"
              setValue={setPredictionYear}
              options={revYears}
              value={predictionYear}
            />
          </div>
        </div>

        {/* State / Location Selection */}
        <div className="filter-section">
          <div className="filter-label">State / Location</div>
          <div className="filter-input">
            <MultiSelectInput
              id="location-input"
              valueParent={selectedStateName}
              valueChildren={dataMode === DATA_MODES.COUNTY ? county : rangerDistrict}
              setValueParent={setStateAbbrev}
              setValueChildren={dataMode === DATA_MODES.COUNTY ? setCounty : setRangerDistrict}
              optionsParent={statesMappedToNames}
              optionsChildren={availableSublocations}
            />
          </div>
        </div>

        {/* Clear Button */}
        <div className="filter-section filter-clear-section">
          <button
            className="action-button clear-button"
            onClick={clearAllSelections}
            type="button"
            disabled={!hasActiveFilters}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterOverlay;
