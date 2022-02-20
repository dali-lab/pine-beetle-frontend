import React, { useState } from 'react';
import Modal from 'react-modal';

import { ChoiceInput } from '../input-components';

import { DATA_MODES } from '../../constants';

import {
  downloadCsv,
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from '../../utils';

import './style.scss';

const closeIcon = require('../../assets/icons/close.png');
const downloadIcon = require('../../assets/icons/download-white.png');

const DownloadData = (props) => {
  const {
    availableYears,
    availableStates,
    availableSublocations,
    county,
    dataMode,
    endYear,
    rangerDistrict,
    selectedState,
    setAllYears,
    setCounty,
    setDataMode,
    setEndYear,
    setRangerDistrict,
    setStartYear,
    setState,
    startYear,
  } = props;

  // vars for year, county, rd selections
  const countyMode = dataMode === DATA_MODES.COUNTY;

  const statesMappedToNames = availableStates.map(abbrev => getStateNameFromAbbreviation(abbrev)).filter(s => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));

  // functions for showing modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isDownloading, setIsDownloading] = useState(false);

  // vars for selecting types of data in modal
  const [fieldsToDownload, setFieldsToDownload] = useState({
    SUMMARIZED: false,
    UNSUMMARIZED: false,
    PREDICTED: false,
  });

  const addFieldToDownload = fieldName => e => setFieldsToDownload({
    ...fieldsToDownload,
    [fieldName]: e.target.checked,
  });

  const selectAll = (selected) => {
    setFieldsToDownload({
      ...fieldsToDownload,
      SUMMARIZED: selected,
      UNSUMMARIZED: selected,
      PREDICTED: selected,
    });
  };

  // function for handling trapping data download
  const handleDownload = async () => {
    const promises = Object.entries(fieldsToDownload).map(async ([fieldName, value]) => {
      if (!value) return null;

      const dataTypeName = countyMode ? 'COUNTY' : 'RD';
      const dataName = fieldName === 'UNSUMMARIZED' ? fieldName : `${fieldName}_${dataTypeName}`;

      return downloadCsv(dataName, {
        state: selectedState,
        [countyMode ? 'county' : 'rangerDistrict']: countyMode ? county : rangerDistrict,
        startYear,
        endYear,
      });
    }).filter(f => !!f);

    if (promises.length > 0) {
      setIsDownloading(true);
      await Promise.all(promises);
      setIsDownloading(false);
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
        className="modal"
        ariaHideApp={false}
        closeTimeoutMS={150}
      >
        <div id="close-icon">
          <img src={closeIcon} alt="close icon" onClick={handleClose} />
        </div>
        <div id="modal-title">Download Data</div>
        <div id="modal-year">
          <div id="year-selection">
            <div id="start-year-selection"><ChoiceInput instructions="Start Year" setValue={setStartYear} options={availableYears} value={startYear} /></div>
            <div id="vl3" />
            {/* TODO: "to" */}
            <div id="end-year-selection"><ChoiceInput instructions="End Year" setValue={setEndYear} options={availableYears} value={endYear} /></div>
          </div>
          <div>
            <button
              type="button"
              onClick={setAllYears}
              id="all-years-button"
              className="animated-button"
            >
              Select all years
            </button>
          </div>
        </div>
        <div id="modal-state-county-rd">
          <ChoiceInput instructions="Select State" value={selectedStateName} setValue={setStateAbbrev} options={statesMappedToNames} firstOptionText="State" />
          <div id="vl1" />
          <div className="menuInstruction">
            <div id="mode-selection">
              <button
                id="mode-btn"
                onClick={() => setDataMode(DATA_MODES.COUNTY)}
                className={(countyMode) ? 'county-rd-selection' : null}
                type="button"
              >
                County
              </button>
              <div id="vl2" />
              <button
                id="mode-btn"
                onClick={() => setDataMode(DATA_MODES.RANGER_DISTRICT)}
                className={(!countyMode) ? 'county-rd-selection' : null}
                type="button"
              >
                <span className="full-text">Ranger District</span>
                <span className="short-text">RD</span>
              </button>
            </div>
            <div>
              <ChoiceInput
                value={countyMode ? county : rangerDistrict}
                setValue={countyMode ? setCounty : setRangerDistrict}
                options={availableSublocations}
                firstOptionText={countyMode ? 'County' : 'Ranger District'}
              />
            </div>
          </div>
        </div>
        <div id="modal-download-selection">
          <div id="question">
            <h4>What type of data would you like to download?</h4>
            <div>
              <label htmlFor="select-all">
                <input
                  type="checkbox"
                  id="select-all"
                  onChange={e => selectAll(e.target.checked)}
                  checked={fieldsToDownload.SUMMARIZED && fieldsToDownload.UNSUMMARIZED && fieldsToDownload.PREDICTED}
                />
                <span className="checkbox-text">Select All</span>
              </label>
            </div>
          </div>
          <div id="selection-types">
            <div>
              <label htmlFor="summarized-data">
                <input
                  type="checkbox"
                  id="summarized-data"
                  onChange={addFieldToDownload('PREDICTED')}
                  checked={fieldsToDownload.PREDICTED}
                />
                <span className="checkbox-text">Predicted data</span>
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
                <span className="checkbox-text">Summarized data by year/location</span>
              </label>
            </div>
            <div>
              <label htmlFor="unsummarized-data">
                <input
                  type="checkbox"
                  id="unsummarized-data"
                  onChange={addFieldToDownload('UNSUMMARIZED')}
                  checked={fieldsToDownload.UNSUMMARIZED}
                />
                <span className="checkbox-text">Raw trapping data</span>
              </label>
            </div>
          </div>
          <div>
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
                <img
                  src={downloadIcon}
                  alt="download icon"
                />
                <p>Submit</p>
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DownloadData;
