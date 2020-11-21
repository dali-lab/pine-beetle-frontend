import React from 'react';
import './style.scss';

const trapIcon = require('../../../../assets/icons/trap.png');
const cleridIcon = require('../../../../assets/icons/clerids.png');

const PredictionDetails = (props) => {
  const {
    data = [],
  } = props;

  const currYear = data[0]?.year ?? (new Date()).getFullYear();

  return (
    <div>
      <div className="prediction-details-container">
        <div className="prediction-details">
          <div className="prediction-title">
            <h1>{data[0].county} Detail</h1>
            <p>{data[0].year} Prediction</p>
          </div>
          <div className="prediction-info">
            <div className="percentages">
              <div className="prediction-circle">
                <div className="circle" id="any-spots">
                  <div id="percent">{((data[0].prediction['prob.Spots>0']) * 100).toFixed(1)}%</div>
                  <p>Predicted % Chance of Any Spots ({'>'}0 spots)</p>
                </div>
              </div>
              <div className="prediction-circle">
                <div className="circle" id="outbreak">
                  <div id="percent">{((data[0].prediction['prob.Spots>53']) * 100).toFixed(1)}%</div>
                  <p>Predicted % Chance of Outbreak ({'>'}50 spots)</p>
                </div>
              </div>
            </div>
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
                <div className="yeart1-clerids" id="clerids">
                  <hr />
                  <div className="content-container">
                    <img
                      src={cleridIcon}
                      alt="clerids"
                    />
                    <div className="content-text">{Math.round(data[0].cleridst1)} <u>clerids</u></div>
                  </div>
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
                    <div className="content-text">{Math.round(data[0].SPB)} <u>SPB</u></div>
                  </div>
                </div>
                <div className="curr-endobrev" id="endobrev">
                  <hr />
                  <div className="content-container">
                    <div className="content-text">{(data[0].endobrev === 0) ? 'no' : 'yes'} <u>endo-brevicomin</u></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDetails;
