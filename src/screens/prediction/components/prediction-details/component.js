import React from 'react';
import './style.scss';

const trapIcon = require('../../../../assets/icons/trap.png');
const cleridIcon = require('../../../../assets/icons/clerids.png');

const PredictionDetails = () => {
  const currYear = 2020;
  // TODO: figure out how to get data in here?
  return (
    <div className="prediction-details">
      <div id="subtitle">
        <p>{currYear} Predictions</p>
      </div>
      <div className="percentages">
        <div className="prediction-circle">
          <div className="circle">
            <p id="percent">10.2%</p>
            <p>Probability of Any Spots</p>
          </div>
        </div>
        <div className="prediction-circle">
          <div className="circle">
            <p id="percent">0.2%</p>
            <p>Probability of Outbreak</p>
          </div>
        </div>
        <div className="prediction-circle">
          <div className="circle">
            <p id="percent">0.23%</p>
            <p>Expected Number of Spots</p>
          </div>
        </div>
      </div>
      <div className="prediction-table">
        <table>
          <tr>
            {/* <td><div id="bullet" /></td> */}
            <td>{currYear}</td>
            <td />
            <td id="spots">
              <img
                src={trapIcon}
                alt="spots"
              />
              3.53 spots
            </td>
          </tr>
          <tr>
            {/* <td><div id="bullet" /></td> */}
            <td>{currYear + 1}</td>
            <td id="clerids">
              <img
                src={cleridIcon}
                alt="clerids"
              />
              17 clerids
            </td>
            <td id="spots">
              <img
                src={trapIcon}
                alt="spots"
              />
              0.32 spots
            </td>
          </tr>
          <tr>
            {/* <td><div id="bullet" /></td> */}
            <td>Spring {currYear + 2}</td>
            <td id="spb">
              <img
                src={cleridIcon}
                alt="spb"
              />
              0.45 SPB
            </td>
            <td id="endobrev">1 endobrev</td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default PredictionDetails;
