import React, { useState } from 'react';

import { DATA_MODES } from '../../constants';
import {
  getStateAbbreviationFromStateName,
  getStateNameFromAbbreviation,
} from '../../utils';
// Assuming these are custom components that will inherit the new styles via SCSS
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
    // Optional props for customization
    title = 'Filter Predictions',
  } = props;

  // State for collapsible functionality
  const [isExpanded, setIsExpanded] = useState(true);

  // Logic to map state abbreviations to full names
  const statesMappedToNames = availableStates.map((abbrev) => getStateNameFromAbbreviation(abbrev)).filter((s) => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = (stateName) => setState(getStateAbbreviationFromStateName(stateName));

  const revYears = [...availableYears].reverse();

  // Check for any active filters (Year, State, County, or District)
  const hasActiveFilters = predictionYear || selectedStateName || county?.length > 0 || rangerDistrict?.length > 0;

  // Year label is always 'Year' for single year selection
  const yearLabel = 'Year';

  // Render year selection component - always single year
  const renderYearSelection = () => {
    return (
      <ChoiceInput
        id="year-input"
        setValue={setPredictionYear}
        options={revYears}
        value={predictionYear}
      />
    );
  };

  return (
    // The filter-bar class now provides the Card styling (shadow, border, rounded corners)
    <div className="filter-bar">
      <div className="filter-bar-content">
        <div className="filter-bar-header">
          <h3 className="filter-bar-title">{title}</h3>
          <button
            className="filter-toggle-button"
            onClick={() => setIsExpanded(!isExpanded)}
            type="button"
            aria-label={isExpanded ? 'Hide filters' : 'Show filters'}
          >
            <svg
              className={`filter-arrow ${isExpanded ? 'expanded' : 'collapsed'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* This container implements the single line layout */}
        {isExpanded && (
          <div className="filter-bar-container">
            {/* Year Selection */}
            <div className="filter-section">
              <div className="filter-label">{yearLabel}</div>
              <div className="filter-input">
                {renderYearSelection()}
              </div>
            </div>

            {/* State / Location Selection */}
            <div className="filter-section">
              <div className="filter-label">State / Location</div>
              <div className="filter-input">
                {/* MultiSelectInput handles state and sublocation selection */}
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
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Active Filters Display - only show when expanded */}
        {isExpanded && hasActiveFilters && (
          <div className="active-filters">
            <div className="active-filters-content">
              <span className="active-filters-label">Active filters:</span>

              {/* Year Filter Tag */}
              {predictionYear && (
                <span className="filter-tag">
                  Year: {predictionYear}
                  <button
                    onClick={() => setPredictionYear('')}
                    className="filter-tag-remove"
                    type="button"
                    aria-label="Remove year filter"
                  >
                    <svg className="filter-tag-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}

              {/* State Filter Tag */}
              {selectedStateName && (
                <span className="filter-tag">
                  Location: {selectedStateName}
                  <button
                    onClick={() => setState('')}
                    className="filter-tag-remove"
                    type="button"
                    aria-label="Remove state filter"
                  >
                    <svg className="filter-tag-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}

              {/* County Filter Tag (shows count if multiple are selected) */}
              {county?.length > 0 && (
                <span className="filter-tag">
                  Counties: {county.length} selected
                  <button
                    onClick={() => setCounty([])}
                    className="filter-tag-remove"
                    type="button"
                    aria-label="Remove county filters"
                  >
                    <svg className="filter-tag-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}

              {/* Ranger District Filter Tag (shows count if multiple are selected) */}
              {rangerDistrict?.length > 0 && (
                <span className="filter-tag">
                  Districts: {rangerDistrict.length} selected
                  <button
                    onClick={() => setRangerDistrict([])}
                    className="filter-tag-remove"
                    type="button"
                    aria-label="Remove district filters"
                  >
                    <svg className="filter-tag-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
