import React, { useEffect } from 'react';
import Modal from 'react-modal';

import {
  AboutPredictions,
  OverviewText,
  PredictionDetails,
  PredictionMap,
  ScatterChart,
  SelectionBar,
  ScatterChartSelectionBar,
} from './components';

import { Histogram, Loading } from '../../components';

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
      <div className="container">
        <PredictionMap />
      </div>
      {predModal()}
      <div className="container">
        <h2 className="prediction-chart-title">Predictions versus outcomes</h2>
        <p className="prediction-chart-text">Each point represents one county or ranger district in one year.
          The regression line indicates the overall relationship between predictions and outcomes.
          Points above the line had more SPB spots than predicted. Points below the line had fewer spots than predicted.
          Highlighted points are for the indicated year.
        </p>
      </div>
      <ScatterChartSelectionBar />
      <ScatterChart />
    </div>
  );
};

export default Prediction;
