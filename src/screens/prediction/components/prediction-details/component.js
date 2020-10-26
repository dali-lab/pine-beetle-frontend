import React from 'react';
import './style.scss';

const trapIcon = require('../../../../assets/icons/trap.png');
const cleridIcon = require('../../../../assets/icons/clerids.png');

const PredictionDetails = (props) => {
  const {
    data = [],
  } = props;

  const currYear = data[0].year;
  console.log(data);
  // TODO: figure out how to get data in here?
  return (
    <div className="prediction-details">
      <div id="subtitle">
        <p>{currYear} Predictions</p>
      </div>
      <div className="percentages">
        <div className="prediction-circle">
          <div className="circle" style={{ background: '#FFC148' }}>
            <p id="percent">{data[0].prediction['prob.Spots>0'].toFixed(2)}</p>
            <p>Probability of Any Spots</p>
          </div>
        </div>
        <div className="prediction-circle">
          <div className="circle" style={{ background: '#86CCFF' }}>
            <p id="percent">???</p>
            <p>Probability of Outbreak</p>
          </div>
        </div>
        <div className="prediction-circle">
          <div className="circle" style={{ background: '#86CCFF' }}>
            <p id="percent">{data[0].prediction['Exp spots if outbreak'].toFixed(2)}</p>
            <p>Expected Number of Spots</p>
          </div>
        </div>
      </div>
      <div className="prediction-table">
        <table>
          <tr>
            {/* <td><div id="bullet" /></td> */}
            <td>{currYear - 2}</td>
            <td />
            <td id="spots">
              <img
                src={trapIcon}
                alt="spots"
              />
              {data[0].spotst2} spots
            </td>
          </tr>
          <tr>
            {/* <td><div id="bullet" /></td> */}
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
              {data[0].spotst1} spots
            </td>
          </tr>
          <tr>
            {/* <td><div id="bullet" /></td> */}
            <td>Spring {currYear}</td>
            <td id="spb">
              <img
                src={cleridIcon}
                alt="spb"
              />
              {data[0].SPB} SPB
            </td>
            <td id="endobrev">{data[0].endobrev} endobrev</td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default PredictionDetails;
