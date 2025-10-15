import React from 'react';

import modelOutbreakIcon from '../../assets/icons/model-outbreaks.png';
import statsIcon from '../../assets/icons/stats.png';
import testInputIcon from '../../assets/icons/test-inputs.png';
import zeroIcon from '../../assets/icons/zero.png';

import './style.scss';

const howItWorksContent = [
  {
    title: 'Model the Outbreaks',
    icon: modelOutbreakIcon,
    alt: 'model outbreak icon',
    text: 'We model the number of infestations, commonly referred to as "spots," rather than modeling the beetles themselves. This approach provides more accurate predictions for forest management.',
    color: 'primary',
  },
  {
    title: 'Statistical Analysis',
    icon: statsIcon,
    alt: 'statistics icon',
    text: 'We use zero-inflated regression models to account for the fact that most locations in most years do not experience outbreaks, providing robust predictions across diverse conditions.',
    color: 'accent',
  },
  {
    title: 'Zero Inflation',
    icon: zeroIcon,
    alt: 'zero inflation icon',
    text: 'Because most locations in most years do not experience an outbreak, a very large number of zeroes occurs in the data. Zero-inflation is designed for precisely this kind of data.',
    color: 'secondary',
  },
  {
    title: 'Test Input Variables',
    icon: testInputIcon,
    alt: 'test input variables icon',
    text: 'Predictions incorporate spring trapping data, previous year outbreak history, climate indices like PDSI, and winter severity to provide comprehensive risk assessments.',
    color: 'primary',
  },
];

const Methodology = () => {
  return (
    <div className="methodology-page">
      <div className="page-header">
        <h1>Methodology</h1>
        <p className="page-description">
          Our prediction model uses statistical analysis of historical outbreak data combined with current environmental conditions to provide accurate Southern Pine Beetle outbreak predictions.
        </p>
      </div>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <div className="methodology-content">
            {howItWorksContent.map((element, index) => (
              <div key={`how-it-works-${index + 1}`} className="methodology-step">
                <div className="step-header">
                  <div className="step-number">{index + 1}</div>
                  <h3 className="step-title">{element.title}</h3>
                </div>
                <p className="step-description">
                  {element.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Methodology;
