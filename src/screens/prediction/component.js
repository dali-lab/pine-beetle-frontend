import React, { useEffect } from 'react';
import Modal from 'react-modal';

import {
  AboutPredictions,
  OverviewText,
  PredictionDetails,
  PredictionMap,
  SelectionBar,
} from './components';

import { Loading } from '../../components';

import { DATA_MODES } from '../../constants';

import './style.scss';

import closeIcon from '../../assets/icons/close.png';

import histogrambin1 from '../../assets/images/spb-histogram-bin1.png';
import histogrambin2 from '../../assets/images/spb-histogram-bin2.png';
import histogrambin3 from '../../assets/images/spb-histogram-bin3.png';
import histogrambin4 from '../../assets/images/spb-histogram-bin4.png';
import histogrambin5 from '../../assets/images/spb-histogram-bin5.png';
import histogrambin6 from '../../assets/images/spb-histogram-bin6.png';

const Prediction = (props) => {
  const {
    data,
    fetchErrorText,
    isLoading,
    predictionModal,
    setPredictionModal,
    dataMode,
    setDataMode,
    clearAllSelections,
  } = props;

  // functions for showing modal
  const handleClose = () => setPredictionModal(false);
  const handleShow = () => setPredictionModal(true);

  useEffect(() => {
    clearAllSelections(); // clears selections initially when switching to this tab
  }, [clearAllSelections]);

  const getHistogram = (probSpotsGT50) => {
    if (probSpotsGT50 < 0.025) {
      return histogrambin1;
    } else if (probSpotsGT50 < 0.05) {
      return histogrambin2;
    } else if (probSpotsGT50 < 0.15) {
      return histogrambin3;
    } else if (probSpotsGT50 < 0.25) {
      return histogrambin4;
    } else if (probSpotsGT50 < 0.4) {
      return histogrambin5;
    } else {
      return histogrambin6;
    }
  };

  const predModal = () => {
    if (!predictionModal) return null;
    const { probSpotsGT50 } = data[0];
    const histogram = getHistogram(probSpotsGT50);
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
            <div className="histogram">
              <div id="histogram-title">
                <span>
                  Predicted vs. Observed Outcomes for All Data, 1987-2019 (n=2,978)
                </span>
              </div>
              <img
                src={histogram}
                alt="Histogram for Predicted % Chance of >50 Spots"
              />
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
            className={dataMode === DATA_MODES.COUNTY ? 'selected-option-p' : 'unselected-option-p'}
            onClick={() => setDataMode(DATA_MODES.COUNTY)}
          >
            <p className={dataMode === DATA_MODES.COUNTY ? 'selected-option-text-p' : 'unselected-option-text-p'}>
              Counties
            </p>
          </div>
          <div
            className={dataMode !== DATA_MODES.COUNTY ? 'selected-option-p' : 'unselected-option-p'}
            onClick={() => setDataMode(DATA_MODES.RANGER_DISTRICT)}
          >
            <p className={dataMode !== DATA_MODES.COUNTY ? 'selected-option-text-p' : 'unselected-option-text-p'}>
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
