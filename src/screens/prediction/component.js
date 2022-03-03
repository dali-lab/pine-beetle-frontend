import React, { useEffect } from 'react';
import Modal from 'react-modal';

import {
  AboutPredictions,
  OverviewText,
  PredictionChart,
  PredictionDetails,
  PredictionMap,
  SelectionBar,
} from './components';

import {
  Loading,
} from '../../components';

import { CHART_MODES, DATA_MODES } from '../../constants';

import './style.scss';

const closeIcon = require('../../assets/icons/close.png');
const mapSelectedIcon = require('../../assets/icons/map-selected.png');
const mapUnselectedIcon = require('../../assets/icons/map-unselected.png');
const graphSelectedIcon = require('../../assets/icons/graph-selected.png');
const graphUnselectedIcon = require('../../assets/icons/graph-unselected.png');

const histogrambin1 = require('../../assets/images/spb-histogram-bin1.png');
const histogrambin2 = require('../../assets/images/spb-histogram-bin2.png');
const histogrambin3 = require('../../assets/images/spb-histogram-bin3.png');
const histogrambin4 = require('../../assets/images/spb-histogram-bin4.png');
const histogrambin5 = require('../../assets/images/spb-histogram-bin5.png');
const histogrambin6 = require('../../assets/images/spb-histogram-bin6.png');

const Prediction = (props) => {
  const {
    data,
    fetchErrorText,
    isLoading,
    predictionModal,
    setPredictionModal,
    chartMode,
    dataMode,
    setChartMode,
    setDataMode,
    clearAllSelections,
  } = props;

  // functions for showing modal
  const handleClose = () => setPredictionModal(false);
  const handleShow = () => setPredictionModal(true);

  const isGraphView = chartMode === CHART_MODES.GRAPH;
  const setGraphView = () => setChartMode(CHART_MODES.GRAPH);
  const setMapView = () => setChartMode(CHART_MODES.MAP);

  useEffect(() => {
    clearAllSelections(); // clears selections initially when switching to this tab
  }, []);

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
      {fetchErrorText.length > 0 && fetchErrorText.map(t => <p>{t}</p>)}
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
        <div className="selection-p">
          <div
            className={isGraphView ? 'selected-option-2-p' : 'unselected-option-p'}
            onClick={() => { setGraphView(); clearAllSelections(); }}
          >
            <img
              src={isGraphView ? graphSelectedIcon : graphUnselectedIcon}
              alt="Chart View"
              className={isGraphView ? 'selected-view-p' : 'unselected-view-p'}
            />
            <p className={isGraphView ? 'selected-option-text-p' : 'unselected-option-text-p'}>
              Graph View
            </p>
          </div>
          <div
            className={isGraphView ? 'unselected-option-p' : 'selected-option-2-p'}
            onClick={() => { setMapView(); clearAllSelections(); }}
          >
            <img
              src={isGraphView ? mapUnselectedIcon : mapSelectedIcon}
              alt="Map View"
              className={isGraphView ? 'unselected-view-p' : 'selected-view-p'}
            />
            <p className={isGraphView ? 'unselected-option-text-p' : 'selected-option-text-p'}>
              Map View
            </p>
          </div>
        </div>
      </div>
      <div className="container">
        {isGraphView ? <PredictionChart /> : <PredictionMap />}
      </div>
      {predModal()}
    </div>
  );
};

export default Prediction;
