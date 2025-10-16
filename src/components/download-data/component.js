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

      <div className="dataset-overview">
        <div className="dataset-header">
          <h2>About This Dataset</h2>
          <p>Download Southern Pine Beetle trapping data for your research, analysis, or educational projects</p>
        </div>

        <div className="dataset-stats">
          <div className="stat-card">
            <div className="stat-number">35+</div>
            <div className="stat-label">Years Available</div>
            <div className="stat-desc">From 1987 to present</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">15</div>
            <div className="stat-label">States Covered</div>
            <div className="stat-desc">Across the Southern US</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">2</div>
            <div className="stat-label">Data Formats</div>
            <div className="stat-desc">Raw & Summary data</div>
          </div>
        </div>

        <div className="dataset-details">
          <div className="detail-section">
            <h4>What You&apos;ll Get</h4>
            <p><strong>Raw Data:</strong> Individual trap records with exact dates and locations for detailed analysis</p>
            <p><strong>Summary Data:</strong> Annual totals by county or federal land for trend analysis and mapping</p>
          </div>
          <div className="detail-section">
            <h4>How to Use This Data</h4>
            <p>Perfect for research papers, GIS mapping, statistical analysis, or educational projects. Data works with Excel, R, Python, ArcGIS, and other analysis tools.</p>
          </div>
          <div className="detail-section">
            <h4>Data Collection</h4>
            <p>Traps are deployed March through June each year using standardized protocols. All data is field-verified for accuracy and consistency.</p>
          </div>
          <div className="detail-section">
            <h4>File Details</h4>
            <p>CSV format with UTF-8 encoding ensures compatibility with all major software. Files include column headers and clear field descriptions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadData;
