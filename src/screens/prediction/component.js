import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom';

import {
  AboutPredictions,
  OverviewText,
  PredictionDetails,
  PredictionMap,
} from './components';

import closeIcon from '../../assets/icons/close.png';
import { FilterBar, Histogram, Loading } from '../../components';
import { ROUTES } from '../../constants';

import './style.scss';

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

  const history = useHistory();

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
      <div className="container">
        <FilterBar />
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button
            onClick={() => history.push(ROUTES.RESULTS_COMPARISON)}
            type="button"
            className="action-button primary-button"
            data-tip="Map of predicted vs. observed outbreaks"
          >
            How did we do?
          </button>
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
