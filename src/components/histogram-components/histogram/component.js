import React from 'react';
import SingleChart from '../single-chart/component';

import './style.scss';

const Histogram = ({ frequencyArray }) => {
  const getXAxisLegend = () => {
    const legend = frequencyArray.map((item) => {
      const rangeArray = item.range.split('-');

      if (rangeArray[0] === '0') {
        return `< ${rangeArray[1] * 100}%`;
      } else if (rangeArray[1] === '1') {
        return `> ${rangeArray[0] * 100}%`;
      }

      return `${rangeArray[0] * 100} - ${rangeArray[1] * 100}%`;
    });
    return legend;
  };

  // the max value for the x axis of single chart
  const globalMax = Math.ceil(
    Math.max(...frequencyArray.flatMap((item) => item.data)) / 100,
  ) * 100; // calculate the max value from all the histogram data and round it up to the nearest multiple of 100

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
          {frequencyArray.map((item, index) => (
            <SingleChart
              key={`histogramBin-${index + 1}`}
              frequency={item.frequency}
              withBorder={item.withBorder}
              globalMax={globalMax}
              data={item.data}
            />
          ))}
        </div>
        <div className="histogram__legend--x-axis">
          {getXAxisLegend().map((item, index) => (
            <p key={`legendBin-${index + 1}`}>
              {item}
            </p>
          ))}
        </div>
        <h4 className="histogram__x-axis-title">
          {'Predicted % chance of > 50 spots'}
        </h4>
      </div>
    </div>
  );
};

export default Histogram;
