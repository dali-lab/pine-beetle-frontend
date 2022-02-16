import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';

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
  ScrollIcon,
} from '../../components';

import { CHART_MODES } from '../../constants';

import './style.scss';

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
    chartMode,
    setChartMode,
  } = props;

  const [showAnimation, setShowAnimation] = useState(true);
  const isGraphView = chartMode === CHART_MODES.GRAPH;
  const setGraphView = () => setChartMode(CHART_MODES.GRAPH);
  const setMapView = () => setChartMode(CHART_MODES.MAP);

  useEffect(() => {
    const listener = () => {
      if (window.scrollY > 1100 || (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        setShowAnimation(false);
      } else {
        setShowAnimation(true);
      }
    };

    window.addEventListener('scroll', listener);
    return () => window.removeEventListener('scroll', listener);
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

  const predDetails = (hasPredData) => {
    if (!hasPredData) return null;
    const { probSpotsGT50 } = data[0];
    const histogram = getHistogram(probSpotsGT50);
    return (
      <>
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
        <Link
          to="scroll-to"
          smooth
        >
          <div id={showAnimation ? 'scroll-animation' : 'hidden-animation'}>
            { ScrollIcon() }
          </div>
        </Link>
      </>
    );
  };

  return (
    <div>
      <Loading visible={isLoading} />
      {fetchErrorText.length > 0 && fetchErrorText.map(t => <p>{t}</p>)}
      <OverviewText />
      <SelectionBar />
      <div className="selection-p">
        <div
          className={isGraphView ? 'selected-option-2-p' : 'unselected-option-p'}
          onClick={setGraphView}
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
          onClick={setMapView}
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
      <div className="container">
        {isGraphView ? <PredictionChart /> : <PredictionMap />}
      </div>
      { predDetails(data.length === 1) }
    </div>
  );
};

export default Prediction;
