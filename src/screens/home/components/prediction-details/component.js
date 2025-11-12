import React from 'react';
import ReactTooltip from 'react-tooltip';

import './style.scss';

import { DATA_MODES } from '../../../../constants';

import trapIcon from '../../../../assets/icons/trap.png';
import cleridIcon from '../../../../assets/icons/clerids.png';

import { getFillColor } from '../../../../utils';
import Histogram from '../../../../components/histogram-components/histogram';

const spbText = 'SPB per two weeks, averaged across traps';

const PredictionDetails = (props) => {
  const {
    data = [],
    dataMode,
    onClose,
    isOpen,
    probSpotsGT50,
  } = props;

  if (!isOpen || !data || data.length === 0) {
    return null;
  }

  const currYear = data[0]?.year ?? (new Date()).getFullYear();

  return (
    <div className="prediction-details-modal-overlay" onClick={onClose}>
      <div className="prediction-details-container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="prediction-details-close-button"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        <div className="prediction-details">
          <div className="prediction-title">
            <h1>{dataMode === DATA_MODES.COUNTY ? `${data[0].county} County` : data[0].rangerDistrict} Detail</h1>
          </div>
          <div className="prediction-info">
            <div className="percentages-container">
              <p id="prediction-subtitle">{data[0].year} Prediction</p>
              <div className="percentages">
                <div className="prediction-circle">
                  <div className={`circle color-fill-with-shadow ${getFillColor(data[0].probSpotsGT0).colorName}`} id="any-spots">
                    <div id="percent">{((data[0].probSpotsGT0) * 100).toFixed(1)}%</div>
                    <p>Predicted % Chance of Any Spots ({'>'}0 spots)</p>
                  </div>
                </div>
                <div className="prediction-circle">
                  <div className={`circle color-fill-with-shadow ${getFillColor(data[0].probSpotsGT50).colorName}`} id="outbreak">
                    <div id="percent">{((data[0].probSpotsGT50) * 100).toFixed(1)}%</div>
                    <p>Predicted % Chance of Outbreak ({'>'}50 spots)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="prediction-grid-title-container">
              <p id="prediction-subtitle">Model Input Variables</p>
              <div className="prediction-grid-container">
                <div className="bullets">
                  <div className="bullet" />
                  <div className="bullet" />
                  <div className="bullet" />
                </div>
                <div className="prediction-grid">
                  <div className="yeart2">
                    <div className="year-title">{currYear - 2}</div>
                  </div>
                  <div className="yeart2-spots" id="spots">
                    <div className="content-container">
                      <img
                        src={trapIcon}
                        alt="spots"
                      />
                      <div className="content-text">{Math.round(data[0].spotst2)} <u>spots</u></div>
                    </div>
                  </div>
                  <div className="yeart1">
                    <hr />
                    <div className="year-title">{currYear - 1}</div>
                  </div>
                  <div className="yeart1-spots" id="spots">
                    <hr />
                    <div className="content-container">
                      <img
                        src={trapIcon}
                        alt="spots"
                      />
                      <div className="content-text">{Math.round(data[0].spotst1)} <u>spots</u></div>
                    </div>
                  </div>
                  <div className="curr-year">
                    <hr />
                    <div className="year-title">{currYear}</div>
                  </div>
                  <div className="curr-spb" id="spb">
                    <hr />
                    <div className="content-container">
                      <img
                        src={cleridIcon}
                        alt="spb"
                      />
                      <div className="content-text" data-tip={spbText}>{Math.round(data[0].spbPer2Weeks)} <u>SPB</u></div>
                      <ReactTooltip multiline place="right" />
                    </div>
                  </div>
                  <div className="curr-endobrev" id="endobrev">
                    <hr className="content-horizontal-rule" />
                    <div className="content-container">
                      <div className="content-text">{(data[0].endobrev === 0) ? 'no' : 'yes'} <u>endo-brevicomin</u></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="prediction-histogram-section">
            <h3 className="prediction-histogram-title">
              Predicted vs. Observed Outcomes for All Data, 1987-2025 (n=3,964)
            </h3>
            <Histogram probSpotsGT50={probSpotsGT50} />
            <div className="about-predictions">
              <p>
                The predictive model gives the probability for various levels of southern pine beetle spot severity.
              </p>
              <p>
                We describe the probability of an outbreak as the probability of more than 50 spots, though various forest professionals may use other benchmarks.
              </p>
              <p>
                Please note that the model is probabilistic. An outcome with a low probability may nevertheless occur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDetails;
