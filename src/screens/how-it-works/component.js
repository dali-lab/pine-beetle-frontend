import React from 'react';
import './style.scss';

const trees = require('../../assets/Trees.png');
const coloredDots = require('../../assets/colored-dots-ns.png');
const pinkImg = require('../../assets/pink-img.png');
const blueImg = require('../../assets/blue-img.png');
const orangeImg = require('../../assets/orange-img.png');
const greenImg = require('../../assets/green-img.png');
const acorn = require('../../assets/acorn.png');
const modelDynamics = require('../../assets/model_dynamics.png');

const HowItWorks = (_props) => {
  return (
    <div>
      <div className="top-photo">
        <img src={trees} alt="Trees" className="responsive" />
      </div>
      <div className="rectangle-box">
        <div className="how">
          <br /><br />How the Model Works
        </div>
        <br />Outbreaking insects can cause millions of acres of damage to forests, even when the insects are native.
        Predicting when outbreaks occur can assist forest managers in planning for financial and personnel needs that arise
        during widespread outbreak, If outbreaks occur on a regular cycle, as some do,they are relatively easy to preditct.
        Southern pine beetle outbreaks, on the other hand, do not occur regularly. In many locations, they may be virtually
        invisible for many years or even decades before irrupting into an outbreak. They may then outbreak again shortly thereafter,
        or retreat again for years at a time. Developing a quantitative model for such a system is challenging. We got there by
        following the steps in the below sections.
      </div>
      <br /><br /><br /><br /><br /><br /><br /><br /><br />
      <div className="long-line">
        <div className="dot-container">
          <img src={coloredDots} alt="dots" className="responsive" />
        </div>
      </div>
      <br />
      <div className="row">
        <div className="column">
          <div className="galleryP">
            <img src={pinkImg} alt="pink" className="responsive" />
          </div>
        </div>
        <div className="column">
          <div className="galleryB">
            <img src={blueImg} alt="blue" className="responsive" />
          </div>
        </div>
        <div className="column">
          <div className="galleryO">
            <img src={orangeImg} alt="orange" className="responsive" />
          </div>
        </div>
        <div className="column">
          <div className="galleryG">
            <img src={greenImg} alt="green" className="responsive" />
          </div>
        </div>
      </div>
      <div className="row2">
        <div className="column2">
          <div className="gallery-text1">
            MODEL THE OUTBREAKS
          </div>
        </div>
        <div className="column2">
          <div className="gallery-text2">
            USE A STATISTICAL MODEL
          </div>
        </div>
        <div className="column2">
          <div className="gallery-text3">
            APPLY ZERO-INFLATION
          </div>
        </div>
        <div className="column2">
          <div className="gallery-text4">
            TEST INPUT VARIABLES
          </div>
        </div>
      </div>
      <br />
      <div className="rectangle-box-bottom">
        <br /><br />
        <div className="mo-txt">
          <div className="txt-header">
            <div className="acorn">
              <img src={acorn} alt="acorn" className="responsive" />
            </div>
            Model the Outbreaks
          </div>
          <br />We decided not to use traditional modeling techniques that involve modeling the beetles themselves;
          instead we model the number of infestations, commonly referred to as “spots.” Complex population models are
          often difficult to fit to real data, so we opted for an approach that would allow us to use spot data that
          was already being collected by state forest service agencies and their federal counterparts.
        </div>
        <br />
        <div className="row3">
          <div className="column3">
            <img src={modelDynamics} alt="model" className="model-dynamics responsive" />
          </div>
          <div className="column3">
            <div className="less-txt">
              <div className="txt-header">
                <div className="acorn">
                  <img src={acorn} alt="acorn" className="responsive" />
                </div>
                Use a Statistical Model
              </div>
              <br />Rather than using a complex mathematical model, we used a statistical method known as “zero-inflation.”
              It’s basically a fancy version of regression, one of the most basic statistical techniques.
              <br /><br />
              <div className="txt-header">
                <div className="acorn">
                  <img src={acorn} alt="acorn" className="responsive" />
                </div>
                Zero Inflation
              </div>
              <br />Because most locations in most years are not in outbreak, a very large number of zeros occurs in the data
              over the course of the three decades that data have been collected. This means that traditional statistics methods
              cannot be applied. Zero-inflation, however, is designed for precisely this kind of data, and we think it might
              prove to be a robust method for other kinds of irregularly outbreaking insects—not just SPB.
            </div>
          </div>
        </div>
        <br />
        <div className="mo-txt">
          <div className="txt-header">
            <br />
            <div className="acorn">
              <img src={acorn} alt="acorn" className="responsive" />
            </div>
            Test Input Variables
          </div>
          <br />In any prediction model, there are “predictor variables” that help determine the prediction. For example,
          some combination of temperature, precipitation, and soil nutrients might predict crop productivity. To create
          our model of outbreak probability, we tested the following potential predictor variables: # of SPB, # of clerids,
          ratio of SPB/clerids, the three preceding variables both this year and last year, # of spots last year, and #
          of spots the year before. We also tested the size of the forest resource in each location (how many acres of
          SPB host trees were available). Of these, only # of SPB this year, # of clerids last year, and the two previous
          years of spot numbers were helpful in predicting the probability of outbreak. We continue to use these four
          variables in creating our model predictions. We will evaluate the predictor variables each year, potentially
          adding more in the future.
        </div>
        <br /><br />
      </div>
    </div>
  );
};

export default HowItWorks;
