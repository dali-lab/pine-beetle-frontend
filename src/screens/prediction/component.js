import React, { useEffect } from 'react';
import Modal from 'react-modal';

import {
  AboutPredictions,
  OverviewText,
  PredictionDetails,
  PredictionMap,
  SelectionBar,
} from './components';

import { Histogram, Loading } from '../../components';

import { DATA_MODES } from '../../constants';

import './style.scss';

import closeIcon from '../../assets/icons/close.png';

const Prediction = (props) => {
  const {
    data,
    endYear,
    fetchErrorText,
    isLoading,
    predictionModal,
    setPredictionModal,
    dataMode,
    setDataMode,
    clearAllSelections,
    county,
    setCounty,
    rangerDistrict,
    setRangerDistrict,
    frequency,
  } = props;

  // functions for showing modal
  const handleClose = () => {
    setPredictionModal(false);
    if (county.length > 0) {
      setCounty([]);
    }
    if (rangerDistrict.length > 0) {
      setRangerDistrict([]);
    }
  };
  const handleShow = () => setPredictionModal(true);

  useEffect(() => {
    clearAllSelections(); // clears selections initially when switching to this tab
  }, [clearAllSelections]);

  const predModal = () => {
    if (!predictionModal) return null;
    const { probSpotsGT50 } = data[0];

    return (
      <Modal
        isOpen={predictionModal}
        onAfterOpen={handleShow}
        onRequestClose={handleClose}
        contentLabel="Show Prediction Data"
        className="modal"
        ariaHideApp={false}
        closeTimeoutMS={150}
      >
        <div id="close-icon">
          <img src={closeIcon} alt="close icon" onClick={handleClose} />
        </div>
        <div className="container" id="scroll-to">
          <PredictionDetails data={data} />
          <div className="prediction-bottom">
            <div className="histogram-container">
              <div id="histogram-title">
                <span>
                  {`Predicted vs. Observed Outcomes for All Data, 1987-${endYear}
                  (n=${frequency.toLocaleString()})`}
                </span>
              </div>
              <Histogram probSpotsGT50={probSpotsGT50} />
            </div>
            <AboutPredictions />
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div>
      <Loading visible={isLoading} />
      {fetchErrorText.length > 0 && fetchErrorText.map((t) => <p>{t}</p>)}
      <OverviewText />
      <SelectionBar />
      <div id="toggles-overlay">
        <div className="selection-p">
          <div
            className={
              dataMode === DATA_MODES.COUNTY
                ? 'selected-option-p'
                : 'unselected-option-p'
            }
            onClick={() => setDataMode(DATA_MODES.COUNTY)}
          >
            <p
              className={
                dataMode === DATA_MODES.COUNTY
                  ? 'selected-option-text-p'
                  : 'unselected-option-text-p'
              }
            >
              Counties
            </p>
          </div>
          <div
            className={
              dataMode !== DATA_MODES.COUNTY
                ? 'selected-option-p'
                : 'unselected-option-p'
            }
            onClick={() => setDataMode(DATA_MODES.RANGER_DISTRICT)}
          >
            <p
              className={
                dataMode !== DATA_MODES.COUNTY
                  ? 'selected-option-text-p'
                  : 'unselected-option-text-p'
              }
            >
              Federal Land
            </p>
          </div>
        </div>
      </div>
      <div className="container">
        <PredictionMap />
      </div>
      {predModal()}
    </div>
  );
};

export default Prediction;
