import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';

import {
  AboutPredictions,
  OverviewText,
  PredictionDetails,
  PredictionMap,
  SelectionBar,
} from './components';

import {
  DownloadData,
  Loading,
  ScrollIcon,
} from '../../components';

import './style.scss';

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
  } = props;

  const [showAnimation, setShowAnimation] = useState(true);

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
      <PredictionMap />
      { predDetails(data.length === 1) }
      <div id="download-pred-data">
        <DownloadData />
      </div>
    </div>
  );
};

export default Prediction;
