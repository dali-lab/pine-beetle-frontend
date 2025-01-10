import React from 'react';
import SingleChart from '../single-chart/component';

import './style.scss';

const Histogram = () => {
  return (
    <div className="histogram">
      <div className="histogram__legend-container">
        <h4 className="histogram__y-axis-title">Observed number of spots</h4>
        <div className="histogram__legend histogram__legend--yellow">
          <p>{'> 249'}</p>
          <p>100 - 249</p>
          <p>50 - 99</p>
        </div>
        <div className="histogram__legend histogram__legend--blue">
          <p>20 - 49</p>
          <p>10 - 19</p>
          <p>1 - 9</p>
          <p>0</p>
        </div>
      </div>
      <div>
        <div className="histogram__wrapper">
          <SingleChart />
          <SingleChart />
          <SingleChart />
          <SingleChart withBorder />
          <SingleChart />
          <SingleChart />
          <SingleChart />
          <SingleChart />
        </div>
        <div className="histogram__legend--x-axis">
          <p>{'< 2,5%'}</p>
          <p>2,5 - 5%</p>
          <p>5 - 15%</p>
          <p>15 - 25%</p>
          <p>25 - 40%</p>
          <p>40 - 60%</p>
          <p>60 - 80%</p>
          <p>{'> 80%'}</p>
        </div>
        <h4 className="histogram__x-axis-title">
          {'Predicted % chance of > 50 spots'}
        </h4>
      </div>
    </div>
  );
};

export default Histogram;
