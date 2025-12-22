import React, { memo } from 'react';

import { ChoiceInput, MultiSelectInput } from '../../../components/input-components';
import { DATA_MODES } from '../../../constants';
import { DATA_FORMATS } from './constants';

export const TimeRangeFilter = memo(({
  availableYears,
  revYears,
  startYear,
  endYear,
  setStartYear,
  setEndYear,
}) => (
  <div className="filter-card">
    <div className="filter-card-header">
      <div className="filter-label">Time Range</div>
    </div>
    <div className="filter-card-content">
      <div className="year-range-inputs">
        <div className="year-input-group">
          <div className="input-label">Start Year</div>
          <ChoiceInput
            id="start-year-input"
            options={availableYears || []}
            value={startYear}
            setValue={setStartYear}
            firstOptionText="Select start year"
          />
        </div>
        <div className="year-input-group">
          <div className="input-label">End Year</div>
          <ChoiceInput
            id="end-year-input"
            options={revYears}
            value={endYear}
            setValue={setEndYear}
            firstOptionText="Select end year"
          />
        </div>
      </div>
    </div>
  </div>
));

TimeRangeFilter.displayName = 'TimeRangeFilter';

export const GeographicAreaFilter = memo(({
  dataMode,
  setDataMode,
  selectedStateName,
  setStateAbbrev,
  statesMappedToNames,
  county,
  rangerDistrict,
  setCounty,
  setRangerDistrict,
  availableSublocations,
}) => (
  <div className="filter-card">
    <div className="filter-card-header">
      <div className="filter-label">Geographic Area</div>
    </div>
    <div className="filter-card-content">
      <div className="geographic-area-content">
        <div className="admin-level-group">
          <div className="input-label">Administrative Level</div>
          <div className="toggle-buttons">
            <button
              type="button"
              className={`toggle-btn ${dataMode === DATA_MODES.COUNTY ? 'active' : ''}`}
              onClick={() => setDataMode(DATA_MODES.COUNTY)}
            >
              County
            </button>
            <button
              type="button"
              className={`toggle-btn ${dataMode === DATA_MODES.RANGER_DISTRICT ? 'active' : ''}`}
              onClick={() => setDataMode(DATA_MODES.RANGER_DISTRICT)}
            >
              Federal Land
            </button>
          </div>
        </div>
        <div className="location-group">
          <div className="input-label">Location</div>
          <MultiSelectInput
            id="location-input"
            valueParent={selectedStateName}
            valueChildren={dataMode === DATA_MODES.COUNTY ? county : rangerDistrict}
            setValueParent={setStateAbbrev}
            setValueChildren={dataMode === DATA_MODES.COUNTY ? setCounty : setRangerDistrict}
            optionsParent={statesMappedToNames}
            optionsChildren={availableSublocations || []}
          />
        </div>
      </div>
    </div>
  </div>
));

GeographicAreaFilter.displayName = 'GeographicAreaFilter';

export const DataFormatFilter = memo(({
  dataFormat,
  setDataFormat,
}) => (
  <div className="filter-card">
    <div className="filter-card-header">
      <div className="filter-label">Data Format</div>
    </div>
    <div className="filter-card-content">
      <div className="radio-group">
        <label
          className={`radio-item ${dataFormat === DATA_FORMATS.RAW ? 'selected' : ''}`}
          htmlFor="raw-data"
        >
          <input
            type="radio"
            id="raw-data"
            name="data-format"
            value={DATA_FORMATS.RAW}
            checked={dataFormat === DATA_FORMATS.RAW}
            onChange={(e) => setDataFormat(e.target.value)}
          />
          <span className="radio-label">
            <strong>Raw Data</strong>
            <small>Weekly trap captures with individual records</small>
          </span>
        </label>
        <label
          className={`radio-item ${dataFormat === DATA_FORMATS.AGGREGATED ? 'selected' : ''}`}
          htmlFor="aggregated-data"
        >
          <input
            type="radio"
            id="aggregated-data"
            name="data-format"
            value={DATA_FORMATS.AGGREGATED}
            checked={dataFormat === DATA_FORMATS.AGGREGATED}
            onChange={(e) => setDataFormat(e.target.value)}
          />
          <span className="radio-label">
            <strong>Aggregated Data</strong>
            <small>Annual summaries per administrative unit</small>
          </span>
        </label>
      </div>
    </div>
  </div>
));

DataFormatFilter.displayName = 'DataFormatFilter';
