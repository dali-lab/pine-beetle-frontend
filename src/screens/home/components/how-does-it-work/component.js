import React from 'react';

import modelOutbreakIcon from '../../../../assets/icons/model-outbreaks.png';
import statsIcon from '../../../../assets/icons/stats.png';
import testInputIcon from '../../../../assets/icons/test-inputs.png';
import zeroIcon from '../../../../assets/icons/zero.png';

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

const HowItWorks = ({ howItWorksRef }) => {
  return (
    <section id="how-it-works" className="home-how-it-works-section" ref={howItWorksRef}>
      <div className="home-how-it-works-container">
        <div className="home-how-it-works-header">
          <h2 className="home-how-it-works-title">How does it work?</h2>
          <p className="home-how-it-works-subtitle">
            Our prediction model uses statistical analysis of historical outbreak data combined with current
            environmental conditions
          </p>
        </div>

        <div className="home-how-it-works-grid">
          {howItWorksContent.map((element, index) => (
            <div key={`how-it-works-${index + 1}`} className="home-how-it-works-card">
              <div className="home-card-icon-container">
                <div className={`home-card-icon ${element.color}`}>
                  <img
                    className="home-card-icon-image"
                    src={element.icon}
                    alt={element.alt}
                  />
                </div>
              </div>
              <h3 className="home-card-title">{element.title}</h3>
              <p className="home-card-description">
                {element.text}
              </p>
            </div>
          ))}
        </div>

        <div className="home-how-it-works-footer">
          <button
            type="button"
            className="home-learn-more-button"
            onClick={() => { window.location.href = '/methodology'; }}
          >
            Learn more about our methodology
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
