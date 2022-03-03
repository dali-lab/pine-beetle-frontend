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
    setEndYear,
    setStartYear,
    startYear,
    // setAllYears,
    setCounty,
    setDataMode,
    setRangerDistrict,
    setState,
    // trappingData,
  } = props;

  const countyMode = dataMode === DATA_MODES.COUNTY;

  const statesMappedToNames = availableStates.map(abbrev => getStateNameFromAbbreviation(abbrev)).filter(s => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));
  const revYears = [...availableYears].reverse();

  // functions for showing modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isDownloading, setIsDownloading] = useState(false);

  // vars for selecting types of data in modal
  const [fieldsToDownload, setFieldsToDownload] = useState({
    SUMMARIZED: false,
    UNSUMMARIZED: false,
  });

  const addFieldToDownload = fieldName => e => setFieldsToDownload({
    ...fieldsToDownload,
    [fieldName]: e.target.checked,
  });

  // const selectAll = (selected) => {
  //   setFieldsToDownload({
  //     ...fieldsToDownload,
  //     PREDICTION: selected,
  //     SUMMARIZED: selected,
  //     UNSUMMARIZED: selected,
  //     HELPER: selected,
  //     '1988-2009 DATA': selected,
  //   });
  // };

  // function for handling trapping data download
  const handleDownload = async () => {
    const promises = Object.entries(fieldsToDownload).map(async ([fieldName, value]) => {
      if (!value) return null;

      const dataTypeName = countyMode ? 'COUNTY' : 'RD';
      const dataName = fieldName === 'SUMMARIZED' ? `${fieldName}_${dataTypeName}` : fieldName;

      // to allow multiple counties/RD
      const countyString = county.join('&county=');
      const rangerDistrictString = rangerDistrict.join('&rangerDistrict=');

      return downloadCsv(dataName, {
        state: selectedState,
        // [countyMode ? 'county' : 'rangerDistrict']: countyMode ? county : rangerDistrict,
        [countyMode ? 'county' : 'rangerDistrict']: countyMode ? countyString : rangerDistrictString,
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
        className="download-modal"
        ariaHideApp={false}
        closeTimeoutMS={150}
      >
        <div id="close-icon">
          <img src={closeIcon} alt="close icon" onClick={handleClose} />
        </div>
        <div id="modal-title">Download Data</div>
        <div className="modal-divide-flex">
          <div>
            <h4 id="subtitle">Year(s)</h4>
            <div id="modal-year">
              <div id="year-selection">
                <ChoiceInput setValue={setStartYear} options={availableYears} value={startYear} />
                <ChoiceInput setValue={setEndYear} options={revYears} value={endYear} />
              </div>
            </div>
            <div className="selection">
              <div
                className={dataMode === DATA_MODES.COUNTY ? 'selected-option' : 'unselected-option'}
                onClick={() => setDataMode(DATA_MODES.COUNTY)}
              >
                <p className={dataMode === DATA_MODES.COUNTY ? 'selected-option-text' : 'unselected-option-text'}>
                  Counties
                </p>
              </div>
              <div
                className={dataMode !== DATA_MODES.COUNTY ? 'selected-option' : 'unselected-option'}
                onClick={() => setDataMode(DATA_MODES.RANGER_DISTRICT)}
              >
                <p className={dataMode !== DATA_MODES.COUNTY ? 'selected-option-text' : 'unselected-option-text'}>
                  Federal Land
                </p>
              </div>
            </div>
            <h4 id="subtitle">Location(s)</h4>
            <MultiSelectInput
              valueParent={selectedStateName}
              valueChildren={dataMode === DATA_MODES.COUNTY ? county : rangerDistrict}
              setValueParent={setStateAbbrev}
              setValueChildren={dataMode === DATA_MODES.COUNTY ? setCounty : setRangerDistrict}
              optionsParent={statesMappedToNames}
              optionsChildren={availableSublocations}
            />
          </div>
          <div id="divider-line" />
          <div id="modal-download-selection">
            <div id="question">
              <h4>Options</h4>
            </div>
            <div id="selection-types">
              {/* <div>
                <label htmlFor="select-all">
                  <input
                    type="checkbox"
                    id="select-all"
                    onChange={e => selectAll(e.target.checked)}
                    checked={fieldsToDownload.PREDICTION && fieldsToDownload.SUMMARIZED && fieldsToDownload.UNSUMMARIZED}
                  />
                  <span className="checkbox-text">Select All</span>
                </label>
              </div> */}
              <div>
                <label htmlFor="prediction-data">
                  <input
                    type="checkbox"
                    id="prediction-data"
                    onChange={addFieldToDownload('PREDICTION')}
                    checked={fieldsToDownload.PREDICTION}
                  />
                  <span className="checkbox-text">Unsummarized historical data</span>
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
                  <span className="checkbox-text">Model input historical data</span>
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
                  <span className="checkbox-text">Predictions vs outcomes</span>
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
              <p>Download</p>
            </button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DownloadData;
