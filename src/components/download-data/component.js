import React, { useState } from 'react';
import Modal from 'react-modal';

import { ChoiceInput, MultiSelectInput } from '../input-components';

import { DATA_MODES } from '../../constants';

import {
  downloadCsv,
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from '../../utils';

import './style.scss';

import closeIcon from '../../assets/icons/close.png';
import downloadIcon from '../../assets/icons/download-white.png';

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

  // functions for showing modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isDownloading, setIsDownloading] = useState(false);

  const [error, setError] = useState('');

  // vars for selecting types of data in modal
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
    <>
      <div id="download-button-container">
        <button
          onClick={handleShow}
          type="button"
          id="download-button"
          className="animated-button"
        >
          <p>Download Data</p>
          <img
            id="download-icon"
            src={downloadIcon}
            alt="download icon"
          />

        </button>
      </div>

      <Modal
        isOpen={show}
        onAfterOpen={handleShow}
        onRequestClose={handleClose}
        contentLabel="Download Data Modal"
        className="download-modal"
        ariaHideApp={false}
        closeTimeoutMS={150}
      >
        <div id="close-icon">
          <img src={closeIcon} alt="close icon" onClick={handleClose} />
        </div>
        <div id="modal-title">Download Data</div>
        <div className="modal-divide-flex">
          <div className="modal-select">
            <h4 id="subtitle">Year(s)</h4>
            <div id="modal-year">
              <div id="year-selection">
                <ChoiceInput setValue={setStartYear} options={availableYears} value={startYear} firstOptionText="Year" />
                <ChoiceInput setValue={setEndYear} options={revYears} value={endYear} firstOptionText="Year" />
              </div>
            </div>
            <h4 id="subtitle">Location(s)</h4>
            <div id="location-select">
              <div className="selection-p" id="selection-download">
                <div
                  className={countyMode ? 'selected-option-2-p' : 'unselected-option-p'}
                  onClick={() => setDataMode(DATA_MODES.COUNTY)}
                >
                  <p className={countyMode ? 'selected-option-text-p' : 'unselected-option-text-p'}>
                    By County
                  </p>
                </div>
                <div
                  className={countyMode ? 'unselected-option-p' : 'selected-option-2-p'}
                  onClick={() => setDataMode(DATA_MODES.RANGER_DISTRICT)}
                >
                  <p className={countyMode ? 'unselected-option-text-p' : 'selected-option-text-p'}>
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
              className="animated-button download-clear-button"
              onClick={clearAllSelections}
            >
              Clear Selections
            </button>
          </div>
          <div id="divider-line" />
          <div id="modal-download-selection">
            <div id="question">
              <h4>Options</h4>
            </div>
            <div id="selection-types">
              <div>
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
              <div>
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
            <div id="modal-footnote-container">
              <p className="modal-footnote">* helper data includes ranger district name mappings and state abbreviation mappings</p>
              <p className="modal-footnote">** Downloads include both trap (beetle) and spot data, per county/federal unit.
                Trap data are uploaded from approximately March through June of each trapping year, and spot data are uploaded
                for that season by the following January.
              </p>
            </div>
            <div className="submit-btn-container">
              {error && <div className="download-error">{error}</div>}
              {isDownloading ? (
                <div id="downloading-container">
                  <h4>Downloading...</h4>
                </div>
              ) : (
                <button
                  className="animated-button"
                  id="modal-submit-btn"
                  onClick={handleDownload}
                  type="button"
                >
                  <p>Download</p>
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DownloadData;
