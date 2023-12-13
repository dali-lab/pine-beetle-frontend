import React from 'react';

import howItWorksIcon from '../../../../assets/icons/how-it-works.png';
import modelOutbreakIcon from '../../../../assets/icons/model-outbreaks.png';
import testInputIcon from '../../../../assets/icons/test-inputs.png';
import statsIcon from '../../../../assets/icons/stats.png';
import zeroIcon from '../../../../assets/icons/zero.png';

import './style.scss';

const howItWorksContent = [
  {
    title: 'Model the Outbreaks',
    icon: modelOutbreakIcon,
    alt: 'model outbreak icon',
    text: 'We decided not to use traditional modeling techniques that involve modeling the beetles themselves; instead, we model the number of infestations, commonly referred to as “spots.” Complex population models are often difficult to fit to real data, so we opted for an approach that would allow us to use spot data that was already being collected by state forest service agencies and their federal counterparts.',
  },
  {
    title: 'Use a Statistical Model',
    icon: statsIcon,
    alt: 'statistics icon',
    text: 'Rather than using a complex mathematical model, we used a statistical method known as “zero-inflation.” It’s basically a fancy version of regression, one of the most basic statistical techniques.',
  },
  {
    title: 'Zero Inflation',
    icon: zeroIcon,
    alt: 'zero inflation icon',
    text: 'Because most locations in most years do not experience an outbreak, a very large number of zeroes occurs in the data over the course of the three decades that data have been collected. This means that traditional statistics methods cannot be applied. Zero-inflation, however, is designed for precisely this kind of data, and we think it might prove to be a robust method for other kinds of irregularly outbreaking insects—not just SPB.',
  },
  {
    title: 'Test Input Variables',
    icon: testInputIcon,
    alt: 'test input variables icon',
    text: 'In any prediction model, there are “predictor variables” that help determine the prediction. For example, some combination of temperature, precipitation, and soil nutrients might predict crop productivity. To create our model of outbreak probability, we tested the following potential predictor variables: # of SPB, # of clerids, ratio of SPB/clerids, the three preceding variables both this year and last year, # of spots last year, and # of spots the year before. We also tested the size of the forest resource in each location (how many acres of SPB host trees were available). Of these, only # of SPB this year, # of clerids last year, and the two previous years of spot numbers were helpful in predicting the probability of outbreak. We continue to use these four variables in creating our model predictions. We will evaluate the predictor variables each year, potentially adding more in the future.',
  },
];

const HowItWorks = ({ howItWorksRef }) => {
  return (
    <div className="how-it-works" ref={howItWorksRef}>
      <div id="how-it-works-title-container">
        <div id="icon0">
          <img
            id="icon"
            src={howItWorksIcon}
            alt="how it works icon"
          />
        </div>
        <div id="vl" />
        <div id="description-title">How does it work?</div>
      </div>
      {howItWorksContent.map((element, index) => {
        return (
          <div id="description-container" key={`how-it-works-${index + 1}`}>
            <div id="description-title-container">
              <div id={`icon${index + 1}`}>
                <img
                  id="icon"
                  src={element.icon}
                  alt={element.alt}
                />
              </div>
              <div id="vl" />
              <div id="description-title">{element.title}</div>
            </div>
            <div id="description-text">
              {element.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HowItWorks;
