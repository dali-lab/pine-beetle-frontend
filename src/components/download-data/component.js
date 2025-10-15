import React, { useState } from 'react';

import { ChoiceInput, MultiSelectInput } from '../input-components';

import { DATA_MODES } from '../../constants';

import {
  downloadCsv,
  getStateAbbreviationFromStateName,
  getStateNameFromAbbreviation,
} from '../../utils';

import './style.scss';

const DownloadData = (props) => {
  const {
    availableYears,
    availableStates,
    availableSublocations,
    clearAllSelections,
    county,
    dataMode,
    endYear,
    rangerDistrict,
    selectedState,
    setEndYear,
    setStartYear,
    startYear,
    setCounty,
    setDataMode,
    setRangerDistrict,
    setState,
  } = props;

  const countyMode = dataMode === DATA_MODES.COUNTY;

  const statesMappedToNames = availableStates.map((abbrev) => getStateNameFromAbbreviation(abbrev)).filter((s) => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = (stateName) => setState(getStateAbbreviationFromStateName(stateName));
  const revYears = startYear ? availableYears.filter((n) => n >= startYear) : availableYears;

  const [isDownloading, setIsDownloading] = useState(false);

  const [error, setError] = useState('');

  // vars for selecting types of data
  const [fieldsToDownload, setFieldsToDownload] = useState({
    SUMMARIZED: true,
    UNSUMMARIZED: true,
  });

  const addFieldToDownload = (fieldName) => (e) => setFieldsToDownload({
    ...fieldsToDownload,
    [fieldName]: e.target.checked,
  });

  // function for handling trapping data download
  const handleDownload = async () => {
    try {
      setError('');
      const promises = Object.entries(fieldsToDownload).map(async ([fieldName, value]) => {
        if (!value) return null;

        const dataTypeName = countyMode ? 'COUNTY' : 'RD';
        const dataName = fieldName === 'SUMMARIZED'
          ? `${fieldName}_${dataTypeName}`
          : fieldName;

        // to allow multiple counties/RD
        const countyString = county.join('&county=');
        const rangerDistrictString = rangerDistrict.join('&rangerDistrict=');

        return downloadCsv(dataName, {
          state: selectedState,
          [countyMode ? 'county' : 'rangerDistrict']: countyMode ? countyString : rangerDistrictString,
          startYear,
          endYear,
        });
      }).filter((f) => !!f);

      if (promises.length > 0) {
        setIsDownloading(true);
        await Promise.all(promises);
        setIsDownloading(false);
      }
    } catch (err) {
      setIsDownloading(false);
      console.log(err);
      setError('There was an error.');
    }
  };

  return (
    <div className="download-data-page-content">
      <div className="download-form">
        <div className="form-section">
          <h3>Time Range</h3>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Start Year</div>
              <ChoiceInput
                id="start-year"
                setValue={setStartYear}
                options={availableYears}
                value={startYear}
                firstOptionText="Select start year"
              />
            </div>
            <div className="form-group">
              <div className="form-label">End Year</div>
              <ChoiceInput
                id="end-year"
                setValue={setEndYear}
                options={revYears}
                value={endYear}
                firstOptionText="Select end year"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Geographic Area</h3>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Administrative Level</div>
              <div className="toggle-buttons">
                <button
                  type="button"
                  className={`toggle-btn ${countyMode ? 'active' : ''}`}
                  onClick={() => setDataMode(DATA_MODES.COUNTY)}
                >
                  County
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${!countyMode ? 'active' : ''}`}
                  onClick={() => setDataMode(DATA_MODES.RANGER_DISTRICT)}
                >
                  Federal Land
                </button>
              </div>
            </div>
            <div className="form-group">
              <div className="form-label">Location</div>
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
        </div>

        <div className="form-section">
          <h3>Data Format</h3>
          <div className="checkbox-group">
            <label className="checkbox-item" htmlFor="unsummarized-data">
              <input
                type="checkbox"
                id="unsummarized-data"
                onChange={addFieldToDownload('UNSUMMARIZED')}
                checked={fieldsToDownload.UNSUMMARIZED}
              />
              <span className="checkbox-label">
                <strong>Raw Data</strong>
                <small>Weekly trap captures with individual records</small>
              </span>
            </label>
            <label className="checkbox-item" htmlFor="summarized-data">
              <input
                type="checkbox"
                id="summarized-data"
                onChange={addFieldToDownload('SUMMARIZED')}
                checked={fieldsToDownload.SUMMARIZED}
              />
              <span className="checkbox-label">
                <strong>Aggregated Data</strong>
                <small>Annual summaries per administrative unit</small>
              </span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="reset-btn"
            onClick={clearAllSelections}
          >
            Reset
          </button>
          <div className="download-area">
            {error && <div className="error-message">{error}</div>}
            {isDownloading ? (
              <div className="loading-state">
                <div className="spinner" />
                <span>Generating dataset...</span>
              </div>
            ) : (
              <button
                className="download-btn"
                onClick={handleDownload}
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1V11M8 11L5 8M8 11L11 8M1 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download Data
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="data-info">
        <h4>Dataset Information</h4>
        <ul>
          <li><strong>Data Sources:</strong> Trap data collected March-June annually, Spot data updated through January</li>
          <li><strong>File Format:</strong> CSV files with UTF-8 encoding for maximum compatibility</li>
          <li><strong>Geographic Coverage:</strong> Southern United States with county and federal land boundaries</li>
          <li><strong>Time Range:</strong> Historical data from 1987 to present, updated annually</li>
          <li><strong>Data Quality:</strong> Field-verified trapping data with standardized collection protocols</li>
          <li><strong>Additional Files:</strong> Administrative mappings, state abbreviations, and metadata included</li>
        </ul>
      </div>
    </div>
  );
};

export default DownloadData;
