import React from 'react';

import './style.scss';

const trapIcon = require('../../../../assets/icons/trap.png');
const cleridsIcon = require('../../../../assets/icons/clerids.png');
const endobrevIcon = require('../../../../assets/icons/endobrev.png');

const PlayWithModelInputs = () => {
  return (
    <div className="container" id="play-with-model-inputs-container">
      <div className="change-fields-container">
        <div className="change-fields">
          <div id="change-fields-title">
            Change numbers in any of the fields below to gauge effect on predicted risks at right
          </div>
          <div className="field">
            <img
              className="icon"
              id="trap-icon"
              src={trapIcon}
              alt="number of spots icon"
            />
            {/* TODO: render dynamically */}
            <div id="field-text">
              Enter a number for spots in 2018 (whole year)
            </div>
            {/* TODO: make this an input */}
            <div id="input" />
          </div>
          <div className="field">
            <img
              className="icon"
              id="trap-icon"
              src={trapIcon}
              alt="number of spots icon"
            />
            {/* TODO: render dynamically */}
            <div id="field-text">
              Enter a number for spots per 2 weeks in 2019 (whole year)
            </div>
            {/* TODO: make this an input */}
            <div id="input" />
          </div>
          <div className="field">
            <img
              className="icon"
              id="clerids-icon"
              src={cleridsIcon}
              alt="number of clerids icon"
            />
            {/* TODO: render dynamically */}
            <div id="field-text">
              Enter a number for clerids in 2019 (whole year)
            </div>
            {/* TODO: make this an input */}
            <div id="input" />
          </div>
          <div className="field">
            <img
              className="icon"
              id="spb-icon"
              src={trapIcon}
              alt="number of SPB icon"
            />
            {/* TODO: render dynamically */}
            <div id="field-text">
              Enter a number for SPB per 2 weeks in Spring, 2020 (whole year)
            </div>
            {/* TODO: make this an input */}
            <div id="input" />
          </div>
          <div className="field">
            <img
              className="icon"
              id="endobrev-icon"
              src={endobrevIcon}
              alt="endo-brevicomin icon"
            />
            {/* TODO: render dynamically */}
            <div id="field-text">
              Was endo-brevicomin used in Spring, 2020 (whole year)
            </div>
            {/* TODO: make this an input */}
            <div id="input" />
          </div>
        </div>
        <btn id="run-button">
          Run
        </btn>
      </div>
      <div id="vl" />
      <div className="predictions-generated">
        <div id="predictions-generated-title">
          Predicted beetle risks in 2020
        </div>
        {/* TODO: dynamically render data */}
        <div id="prob-spots">
          <div id="percent">
            10.2%
          </div>
          <div id="prob-text">
            Predicted % Chance of Any Spots ({'>'}0 spots)
          </div>
        </div>
        <div id="prob-outbreak">
          <div id="percent">
            0.2%
          </div>
          <div id="prob-text">
            Predicted % Chance of Outbreak ({'>'}50 spots)
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayWithModelInputs;
