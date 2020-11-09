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
    <div className="prediction-details">
      {/* <div id="subtitle">
        <p>{currYear} Predictions</p>
      </div> */}
      <div className="percentages">
        <div className="prediction-circle">
          <div className="circle" style={{ background: '#FFC148' }}>
            <p id="percent">{((data[0].prediction['prob.Spots>0']) * 100).toFixed(1)}%</p>
            <p>Predicted % Chance of Any Spots</p>
          </div>
        </div>
        <div className="prediction-circle">
          <div className="circle" style={{ background: '#86CCFF' }}>
            <p id="percent">{((data[0].prediction['prob.Spots>53']) * 100).toFixed(1)}%</p>
            <p>Predicted % Chance of</p>
            <p id="overflow">Outbreak ({'>'}50 spots)</p>
          </div>
        </div>
        {/* <div className="prediction-circle">
          <div className="circle" style={{ background: '#86CCFF' }}>
            <p id="percent">{Math.round(data[0].prediction['Exp spots if outbreak'])}</p>
            <p>Expected Number</p><p>of Spots</p>
          </div>
        </div> */}
      </div>
      <div className="prediction-grid">
        {/* <table>
          <tr>
            <td>{currYear - 2}</td>
            <td />
            <td id="spots">
              <img
                src={trapIcon}
                alt="spots"
              />
              {Math.round(data[0].spotst2)} spots
            </td>
          </tr>
          <tr>
            <td>{currYear - 1}</td>
            <td id="clerids">
              <img
                src={cleridIcon}
                alt="clerids"
              />
              {Math.round(data[0].cleridst1)} clerids
            </td>
            <td id="spots">
              <img
                src={trapIcon}
                alt="spots"
              />
              {Math.round(data[0].spotst1)} spots
            </td>
          </tr>
          <tr>
            <td>Spring {currYear}</td>
            <td id="spb">
              <img
                src={cleridIcon}
                alt="spb"
              />
              {data[0].SPB.toFixed(1)} SPB
            </td>
            <td id="endobrev">{(data[0].endobrev === 0) ? 'no' : 'yes'} endo-brevicomin</td>
          </tr>
        </table> */}
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
  );
};

export default PredictionDetails;
