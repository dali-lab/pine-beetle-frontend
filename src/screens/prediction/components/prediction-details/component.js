import React from 'react';
import './style.scss';

const trapIcon = require('../../../../assets/icons/trap.png');
const cleridIcon = require('../../../../assets/icons/clerids.png');

const PredictionDetails = (props) => {
  const {
    data = [],
  } = props;

  // https://stackoverflow.com/questions/31984929/connecting-vertical-lines-between-css-elements-that-are-part-of-a-tables-rows

  const currYear = data[0]?.year ?? (new Date()).getFullYear();

  console.log(data);

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
                <div className="col1-row1">
                  {currYear - 2}
                  <p>Whole Year</p>
                </div>
                <div className="col2-row1" />
                <div className="col3-row1" id="spots">
                  <img
                    src={trapIcon}
                    alt="spots"
                  />
                  {Math.round(data[0].spotst2)} spots
                </div>
                <div className="row2"><hr /></div>
                <div className="col1-row3">
                  {currYear - 1}
                  <p>Whole Year</p>
                </div>
                <div className="col2-row3" id="clerids">
                  <img
                    src={cleridIcon}
                    alt="clerids"
                  />
                  {Math.round(data[0].cleridst1)} clerids
                </div>
                <div className="col3-row3" id="spots">
                  <img
                    src={trapIcon}
                    alt="spots"
                  />
                  {Math.round(data[0].spotst1)} spots
                </div>
                <div className="row4"><hr /></div>
                <div className="col1-row5">
                  Spring {currYear}
                </div>
                <div className="col2-row5" id="spb">
                  <img
                    src={cleridIcon}
                    alt="spb"
                  />
                  {data[0].SPB.toFixed(1)} SPB
                </div>
                <div className="col3-row5" id="endobrev">
                  {(data[0].endobrev === 0) ? 'no' : 'yes'} endo-brevicomin
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="histogram-about-container">
        <div className="histogram">histogram</div>
        <div className="about-prediction">about</div>
      </div>
    </div>
  );
};

export default PredictionDetails;
