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
  const revYears = availableYears.filter((n) => n >= startYear);

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
      <div className="download-content-grid">
        <div className="download-selection-section">
          <h3 className="section-title">Year(s)</h3>
          <div className="year-selection">
            <ChoiceInput setValue={setStartYear} options={availableYears} value={startYear} firstOptionText="Start Year" />
            <ChoiceInput setValue={setEndYear} options={revYears} value={endYear} firstOptionText="End Year" />
          </div>

          <h3 className="section-title">Location(s)</h3>
          <div className="location-select">
            <div className="data-mode-selection">
              <div
                className={countyMode ? 'selected-option' : 'unselected-option'}
                onClick={() => setDataMode(DATA_MODES.COUNTY)}
              >
                <p className={countyMode ? 'selected-option-text' : 'unselected-option-text'}>
                  By County
                </p>
              </div>
              <div
                className={countyMode ? 'unselected-option' : 'selected-option'}
                onClick={() => setDataMode(DATA_MODES.RANGER_DISTRICT)}
              >
                <p className={countyMode ? 'unselected-option-text' : 'selected-option-text'}>
                  By Federal land
                </p>
              </div>
            </div>
            <MultiSelectInput
              valueParent={selectedStateName}
              valueChildren={dataMode === DATA_MODES.COUNTY ? county : rangerDistrict}
              setValueParent={setStateAbbrev}
              setValueChildren={dataMode === DATA_MODES.COUNTY ? setCounty : setRangerDistrict}
              optionsParent={statesMappedToNames}
              optionsChildren={availableSublocations}
              listOnly
            />
          </div>

          <button
            type="button"
            className="clear-selections-button"
            onClick={clearAllSelections}
          >
            Clear Selections
          </button>
        </div>

        <div className="download-options-section">
          <h3 className="section-title">Download Options</h3>
          <div className="download-options">
            <div className="option-item">
              <label htmlFor="unsummarized-data">
                <input
                  type="checkbox"
                  id="unsummarized-data"
                  onChange={addFieldToDownload('UNSUMMARIZED')}
                  checked={fieldsToDownload.UNSUMMARIZED}
                />
                <span className="checkbox-text">Unsummarized data with weekly trap captures</span>
              </label>
            </div>
            <div className="option-item">
              <label htmlFor="summarized-data">
                <input
                  type="checkbox"
                  id="summarized-data"
                  onChange={addFieldToDownload('SUMMARIZED')}
                  checked={fieldsToDownload.SUMMARIZED}
                />
                <span className="checkbox-text">Summarized data with one record per year for each county or federal parcel</span>
              </label>
            </div>
          </div>

          <div className="footnote-container">
            <p className="footnote">* Helper data includes ranger district name mappings and state abbreviation mappings</p>
            <p className="footnote">** Downloads include both trap (beetle) and spot data, per county/federal unit.
              Trap data are uploaded from approximately March through June of each trapping year, and spot data are uploaded
              for that season by the following January.
            </p>
          </div>

          <div className="download-button-container">
            {error && <div className="download-error">{error}</div>}
            {isDownloading ? (
              <div className="downloading-container">
                <h4>Downloading...</h4>
              </div>
            ) : (
              <button
                className="download-button"
                onClick={handleDownload}
                type="button"
              >
                <span>Download Data</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadData;
