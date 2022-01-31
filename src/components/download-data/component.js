import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { TextInput, ChoiceInput } from '../input-components';

import { DATA_MODES } from '../../constants';

import {
  downloadCsv,
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from '../../utils';

import './style.scss';

const closeIcon = require('../../assets/icons/close.png');
const downloadIcon = require('../../assets/icons/download.png');

const DownloadData = (props) => {
  const {
    county,
    data,
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

  const [allStates, setAllStates] = useState([]);
  const [allCounties, setAllCounties] = useState([]);
  const [allRangerDistricts, setAllRangerDistricts] = useState([]);

  useEffect(() => {
    setAllStates([...new Set(data.map(obj => obj.state))].sort());
    setAllCounties(selectedState ? [...new Set(data.map((obj => obj.county)))].sort() : []);
    setAllRangerDistricts(selectedState ? [...new Set(data.map((obj => obj.rangerDistrict)))].sort() : []);
  }, [data]);

  const statesMappedToNames = allStates.map(abbrev => getStateNameFromAbbreviation(abbrev)).filter(s => !!s);
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
    HELPER: false,
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
      HELPER: selected,
    });
  };

  // function for handling trapping data download
  const handleDownload = async () => {
    const promises = Object.entries(fieldsToDownload).map(async ([fieldName, value]) => {
      if (!value) return null;

      const dataTypeName = countyMode ? 'COUNTY' : 'RD';
      const dataName = fieldName === 'SUMMARIZED' ? `${fieldName}_${dataTypeName}` : fieldName;

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
          <img
            src={downloadIcon}
            alt="download icon"
          />
          <p>Download Data</p>
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
            <div id="start-year-selection"><TextInput instructions="Year" setValue={setStartYear} value={startYear} /></div>
            <div id="vl3" />
            {/* TODO: "to" */}
            <div id="end-year-selection"><TextInput setValue={setEndYear} value={endYear} /></div>
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
                options={countyMode ? allCounties : allRangerDistricts}
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
                  checked={fieldsToDownload.SUMMARIZED && fieldsToDownload.UNSUMMARIZED}
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
          <div id="extras-row">
            <div id="circle-checkbox">
              <label htmlFor="include-helper">
                <input
                  type="checkbox"
                  id="include-helper"
                  onChange={addFieldToDownload('HELPER')}
                  checked={fieldsToDownload.HELPER}
                />
                <span className="checkbox-text">Include helper data*</span>
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
          <div id="modal-footnote-container">
            <p className="modal-footnote">* helper data includes ranger district name mappings and state abbreviation mappings</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DownloadData;
