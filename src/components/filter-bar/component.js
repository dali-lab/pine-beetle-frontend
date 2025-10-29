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
    startYear,
    endYear,
    rangerDistrict,
    selectedState,
    setCounty,
    setPredictionYear,
    setStartYear,
    setEndYear,
    setRangerDistrict,
    setState,
    clearAllSelections,
    title = 'Filter Predictions',
    useHistoricalData = false,
  } = props;

  const statesMappedToNames = availableStates.map((abbrev) => getStateNameFromAbbreviation(abbrev)).filter((s) => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = (stateName) => setState(getStateAbbreviationFromStateName(stateName));

  const revYears = [...availableYears].reverse();

  const hasActiveFilters = useHistoricalData
    ? (startYear || endYear || selectedStateName || county?.length > 0 || rangerDistrict?.length > 0)
    : (predictionYear || selectedStateName || county?.length > 0 || rangerDistrict?.length > 0);

  const renderYearSelection = () => {
    if (useHistoricalData) {
      // For historical data, show start and end year inputs
      return (
        <div className="year-range-inputs">
          <div className="year-input-group">
            <div className="year-input-label">Start Year</div>
            <ChoiceInput
              id="start-year-input"
              options={availableYears}
              value={startYear}
              setValue={setStartYear}
              firstOptionText="Select start year"
            />
          </div>
          <div className="year-input-group">
            <div className="year-input-label">End Year</div>
            <ChoiceInput
              id="end-year-input"
              options={revYears}
              value={endYear}
              setValue={setEndYear}
              firstOptionText="Select end year"
            />
          </div>
        </div>
      );
    } else {
      // For prediction data, show single year input
      return (
        <ChoiceInput
          id="year-input"
          options={revYears}
          value={predictionYear}
          setValue={setPredictionYear}
        />
      );
    }
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar-content">
        <div className="filter-bar-header">
          <h3 className="filter-bar-title">{title}</h3>
        </div>

        <div className="filter-bar-container">
          <div className="filter-bar-section">
            <div className="filter-bar-label">Year</div>
            <div className="filter-bar-input">
              {renderYearSelection()}
            </div>
          </div>

          <div className="filter-bar-section">
            <div className="filter-bar-label">State / Location</div>
            <div className="filter-bar-input">
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

          <div className="filter-bar-clear-section">
            <div className="filter-bar-label">&nbsp;</div>
            <div className="filter-bar-input">
              <button
                className="filter-bar-action-button filter-bar-clear-button"
                onClick={clearAllSelections}
                type="button"
                disabled={!hasActiveFilters}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="active-filters">
            <div className="active-filters-content">
              <span className="active-filters-label">Active filters:</span>

              {useHistoricalData ? (
                <>
                  {startYear && (
                    <span className="filter-tag">
                      Start Year: {startYear}
                      <button
                        onClick={() => setStartYear('')}
                        className="filter-tag-remove"
                        type="button"
                        aria-label="Remove start year filter"
                      >
                        <svg className="filter-tag-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}

                  {endYear && (
                    <span className="filter-tag">
                      End Year: {endYear}
                      <button
                        onClick={() => setEndYear('')}
                        className="filter-tag-remove"
                        type="button"
                        aria-label="Remove end year filter"
                      >
                        <svg className="filter-tag-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}
                </>
              ) : (
                predictionYear && (
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
                )
              )}

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
