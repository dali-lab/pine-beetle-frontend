import React, { useState } from 'react';
import Modal from 'react-modal';

import { TextInput, ChoiceInput } from '../../../../components/input-components';

import { DATA_MODES } from '../../../../constants';

import {
  downloadCsv,
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from '../../../../utils';

import './style.scss';

const downloadIcon = require('../../../../assets/icons/download.png');

const DownloadTrapping = (props) => {
  const {
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
    trappingData,
  } = props;

  // constants for year, county, rd selections
  const countyMode = dataMode === DATA_MODES.COUNTY;
  const allStates = [...new Set(trappingData.map(obj => obj.state))].sort();
  const allCounties = selectedState ? [...new Set(trappingData.map((obj => obj.county)))].sort() : [];
  const allRangerDistricts = selectedState ? [...new Set(trappingData.map((obj => obj.rangerDistrict)))].sort() : [];
  const statesMappedToNames = allStates.map(abbrev => getStateNameFromAbbreviation(abbrev));
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));

  // constants for showing modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // constants for selecting types of data in modal
  const [fieldsToDownload, setFieldsToDownload] = useState({
    PREDICTION: false,
    SUMMARIZED: false,
    UNSUMMARIZED: false,
    HELPER: false,
  });

  const addFieldToDownload = fieldName => e => setFieldsToDownload({
    ...fieldsToDownload,
    [fieldName]: e.target.checked,
  });

  const selectAll = (selected) => {
    if (selected) {
      setFieldsToDownload({
        ...fieldsToDownload,
        PREDICTION: true,
        SUMMARIZED: true,
        UNSUMMARIZED: true,
      });
    } else {
      setFieldsToDownload({
        ...fieldsToDownload,
        PREDICTION: false,
        SUMMARIZED: false,
        UNSUMMARIZED: false,
      });
    }
  };

  // function for handling trapping data download
  const handleDownload = async () => {
    Object.entries(fieldsToDownload).forEach(async ([fieldName, value]) => {
      if (!value) return;

      const dataTypeName = countyMode ? 'COUNTY' : 'RD';
      const dataName = fieldName === 'PREDICTION' || fieldName === 'SUMMARIZED' ? `${fieldName}_${dataTypeName}` : fieldName;

      await downloadCsv(dataName, {
        state: selectedState,
        [countyMode ? 'county' : 'rangerDistrict']: countyMode ? county : rangerDistrict,
        startYear,
        endYear,
      });
    });
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
      >
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
            <p>What type of data would you like to download?</p>
            <div id="data-checkbox">
              <label htmlFor="select-all">
                <input
                  type="checkbox"
                  id="select-all"
                  onChange={e => selectAll(e.target.checked)}
                  checked={fieldsToDownload.PREDICTION && fieldsToDownload.SUMMARIZED && fieldsToDownload.UNSUMMARIZED}
                />
                <span id="checkbox-text">Select All</span>
              </label>
            </div>
          </div>
          <div id="selection-types">
            <div id="data-checkbox">
              <label htmlFor="prediction-data">
                <input
                  type="checkbox"
                  id="prediction-data"
                  onChange={addFieldToDownload('PREDICTION')}
                  checked={fieldsToDownload.PREDICTION}
                />
                <span id="checkbox-text">Prediction data</span>
              </label>
            </div>
            <div id="data-checkbox">
              <label htmlFor="summarized-data">
                <input
                  type="checkbox"
                  id="summarized-data"
                  onChange={addFieldToDownload('SUMMARIZED')}
                  checked={fieldsToDownload.SUMMARIZED}
                />
                <span id="checkbox-text">Summarized data</span>
              </label>
            </div>
            <div id="data-checkbox">
              <label htmlFor="unsummarized-data">
                <input
                  type="checkbox"
                  id="unsummarized-data"
                  onChange={addFieldToDownload('UNSUMMARIZED')}
                  checked={fieldsToDownload.UNSUMMARIZED}
                />
                <span id="checkbox-text">Unsummarized data</span>
              </label>
            </div>
          </div>
          <div id="circle-checkbox">
            <label htmlFor="include-helper">
              <input
                type="checkbox"
                id="include-helper"
                onChange={addFieldToDownload('HELPER')}
                checked={fieldsToDownload.HELPER}
              />
              <span id="checkbox-text">Include helper data*</span>
            </label>
          </div>
          <div>
            <button
              type="button"
              id="modal-submit-btn"
              className="animated-button"
              onClick={handleDownload}
            >
              <img
                src={downloadIcon}
                alt="download icon"
              />
              <p>Submit</p>
            </button>
          </div>
          <p id="modal-footnote">* helper data includes state/fips mappings and ranger district standardization mappings</p>
        </div>
      </Modal>
    </>
  );
};

export default DownloadTrapping;
