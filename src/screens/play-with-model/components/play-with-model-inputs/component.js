import React from 'react';

import './style.scss';

const trapIcon = require('../../../../assets/icons/trap.png');
const cleridsIcon = require('../../../../assets/icons/clerids.png');
const endobrevIcon = require('../../../../assets/icons/endobrev.png');

const PlayWithModelInputs = (props) => {
  const {
    modelInputs,
    runModel,
    updateModelInputs,
    year,
  } = props;

  const createValueSetter = (fieldName) => (newValue) => {
    updateModelInputs({
      [fieldName]: newValue,
    });
  };

  const INPUT_INFORMATION = {
    SPOTST2: {
      text: 'Enter a number for spots in {YEAR-2} (whole year)',
      icon: trapIcon,
      iconAlt: 'number of spots icon',
      iconId: 'trap-icon',
      value: parseInt(modelInputs.spotst2, 10),
      setValue: createValueSetter('spotst2'),
      trueFalseSelection: false,
    },
    SPOTST1: {
      text: 'Enter a number for spots in {YEAR-1} (whole year)',
      icon: trapIcon,
      iconAlt: 'number of spots icon',
      iconId: 'trap-icon',
      value: parseInt(modelInputs.spotst1, 10),
      setValue: createValueSetter('spotst1'),
      trueFalseSelection: false,
    },
    CLERIDST1: {
      text: 'Enter a number for clerids per 2 weeks in Spring, {YEAR-1}',
      icon: cleridsIcon,
      iconAlt: 'number of clerids icon',
      iconId: 'clerids-icon',
      value: parseInt(modelInputs.cleridst1, 10),
      setValue: createValueSetter('cleridst1'),
      trueFalseSelection: false,
    },
    SPB: {
      text: 'Enter a number for SPB per 2 weeks in Spring, {YEAR}',
      icon: trapIcon,
      iconAlt: 'number of SPB icon',
      iconId: 'spb-icon',
      value: parseInt(modelInputs.spb, 10),
      setValue: createValueSetter('spb'),
      trueFalseSelection: false,
    },
    ENDOBREV: {
      text: 'Was endo-brevicomin used in Spring, {YEAR}?',
      icon: endobrevIcon,
      iconAlt: 'endo-brevicomin icon',
      iconId: 'endobrev-icon',
      value: modelInputs.endobrev,
      setValue: createValueSetter('endobrev'),
      trueFalseSelection: true,
    },
  };

  const selectionInput = (isTrueFalseSelection, value, setValue) => {
    if (!isTrueFalseSelection) {
      return (
        <form onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}>
          <input
            type="number"
            min="0"
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        </form>
      );
    } else {
      return (
        <form onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}>
          <div className="checkboxes">
            <div className="endobrev-checkbox" onClick={() => setValue(true)}>
              <label htmlFor="yes-endobrev">
                <input
                  type="checkbox"
                  id="yes-endobrev"
                  onChange={() => setValue(true)}
                  checked={value}
                />
                <span>Yes</span>
              </label>
            </div>
            <div className="endobrev-checkbox" onClick={() => setValue(false)}>
              <label htmlFor="no-endobrev" className="no-endobrev-checkbox">
                <input
                  type="checkbox"
                  id="no-endobrev"
                  onChange={() => setValue(false)}
                  checked={!value}
                />
                <span>No</span>
              </label>
            </div>
          </div>
        </form>
      );
    }
  };

  return (
    <div className="change-fields-container">
      <div className="change-fields">
        <div id="change-fields-title">
          <p>Change numbers in any of the fields below to gauge effect on predicted risks at right</p>
        </div>
        {Object.entries(INPUT_INFORMATION).map(([key, inputInfo]) => {
          const {
            text,
            icon,
            iconAlt,
            iconId,
            value,
            setValue,
            trueFalseSelection,
          } = inputInfo;

          return (
            <div className="field" key={key}>
              <div className="icon-text-container">
                <img
                  className="icon"
                  id={iconId}
                  src={icon}
                  alt={iconAlt}
                />
                <div id="field-text">
                  {text
                    .replace('{YEAR}', year)
                    .replace('{YEAR-1}', year - 1)
                    .replace('{YEAR-2}', year - 2)}
                </div>
              </div>
              { selectionInput(trueFalseSelection, value, setValue) }
            </div>
          );
        })}
      </div>
      <button className="animated-button" id="run-button" type="button" onClick={runModel}>
        Run
      </button>
    </div>
  );
};

export default PlayWithModelInputs;
