import React, { useEffect } from 'react';
import SingleChart from '../single-chart/component';
import Loader from '../../loader';

import './style.scss';

const updateWithBorder = (array, probSpotsGT20) => {
  const arrayUpdated = array.map((item) => {
    const rangeArray = item.range.split('-');

    if (probSpotsGT20 >= rangeArray[0] && probSpotsGT20 < rangeArray[1]) {
      return { ...item, withBorder: true };
    } else return item;
  });

  return arrayUpdated;
};

const Histogram = ({ histogramData, getHistogram, probSpotsGT20 }) => {
  useEffect(() => getHistogram(), [getHistogram]);

  const updatedHistogramData = updateWithBorder(histogramData, probSpotsGT20);

  const getXAxisLegend = () => {
    if (updatedHistogramData) {
      const legend = updatedHistogramData.map((item) => {
        const rangeArray = item.range.split('-');

        if (rangeArray[0] === '0') {
          return `< ${rangeArray[1] * 100}%`;
        } else if (rangeArray[1] === '1') {
          return `> ${rangeArray[0] * 100}%`;
        }

        return `${rangeArray[0] * 100} - ${rangeArray[1] * 100}%`;
      });
      return legend;
    }
    return [];
  };

  return (
    updatedHistogramData.length > 0 ? (
      <div className="histogram">
        <div className="histogram__legend-container">
          <h4 className="histogram__y-axis-title">Observed number of spots</h4>
          <div className="histogram__legend histogram__legend--yellow">
            <p>{'> 249'}</p>
            <p>100 - 249</p>
            <p>50 - 99</p>
            <p>20 - 49</p>
          </div>
          <div className="histogram__legend histogram__legend--blue">
            <p>10 - 19</p>
            <p>1 - 9</p>
            <p>0</p>
          </div>
        </div>
        <div>
          <div className="histogram__wrapper">
            {updatedHistogramData.map((item, index) => (
              <SingleChart
                key={`histogramBin-${index + 1}`}
                frequency={item.frequency}
                withBorder={item.withBorder}
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
            {'Predicted % chance of > 20 spots'}
          </h4>
        </div>
      </div>
    ) : (
      <div className="histogram__loader">
        <Loader />
      </div>
    )
  );
};

export default Histogram;
