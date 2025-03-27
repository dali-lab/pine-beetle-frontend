import React from 'react';
import './style.scss';

const AboutPredictions = () => {
  return (
    <div className="about-predictions">
      <div className="about-title">About Predictions</div>
      <ul>
        <li>The predictive model gives the probability for various levels of southern pine beetle spot severity.</li>
        <li>We describe the probability of an outbreak as the probability of more than 50 spots, though various forest professionals may use other benchmarks.</li>
        <li>Please note that the model is probabilistic. An outcome with a low probability may nevertheless occur. </li>
      </ul>
    </div>
  );
};

export default AboutPredictions;
