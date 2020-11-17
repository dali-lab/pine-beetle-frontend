import React from 'react';

const trapIcon = require('../../../../assets/icons/trap.png');
const cleridsIcon = require('../../../../assets/icons/clerids.png');
const endobrevIcon = require('../../../../assets/icons/endobrev.png');

const InputContainer = (props) => {
  const {
    modelInputs,
    runModel,
    setModelInputs,
    year,
  } = props;

  const createValueSetter = fieldName => (newValue) => {
    setModelInputs({
      [fieldName]: newValue,
    });
  };

  const INPUT_INFORMATION = {
    SPOTST2: {
      text: 'Enter a number for spots in {YEAR-2} (whole year)',
      icon: trapIcon,
      iconAlt: 'number of spots icon',
      iconId: 'trap-icon',
      value: modelInputs.spotst2,
      setValue: createValueSetter('spotst2'),
    },
    SPOTST1: {
      text: 'Enter a number for spots in {YEAR-1} (whole year)',
      icon: trapIcon,
      iconAlt: 'number of spots icon',
      iconId: 'trap-icon',
      value: modelInputs.spotst1,
      setValue: createValueSetter('spotst1'),
    },
    CLERIDST1: {
      text: 'Enter a number for clerids in {YEAR-1} (whole year)',
      icon: cleridsIcon,
      iconAlt: 'number of clerids icon',
      iconId: 'clerids-icon',
      value: modelInputs.cleridst1,
      setValue: createValueSetter('cleridst1'),
    },
    SPB: {
      text: 'Enter a number for SPB per 2 weeks in Spring, {YEAR} (whole year)',
      icon: trapIcon,
      iconAlt: 'number of SPB icon',
      iconId: 'spb-icon',
      value: modelInputs.spb,
      setValue: createValueSetter('spb'),
    },
    ENDOBREV: {
      text: 'Was endo-brevicomin used in Spring, {YEAR} (whole year)',
      icon: endobrevIcon,
      iconAlt: 'endo-brevicomin icon',
      iconId: 'endobrev-icon',
      value: modelInputs.endobrev,
      setValue: createValueSetter('endobrev'),
    },
  };

  return (
    <div className="change-fields-container">
      <div className="change-fields">
        <div id="change-fields-title">
          Change numbers in any of the fields below to gauge effect on predicted risks at right
        </div>
        {Object.values(INPUT_INFORMATION).map((inputInfo) => {
          const {
            text,
            icon,
            iconAlt,
            iconId,
            value,
            setValue,
          } = inputInfo;

          return (
            <div className="field">
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
              <div id="input">
                <input
                  onChange={e => setValue(e.target.value.length > 0 ? parseInt(e.target.value, 10) : '')}
                  value={value}
                />
              </div>
            </div>
          );
        })}
      </div>
      <button id="run-button" type="button" onClick={runModel}>
        Run
      </button>
    </div>
  );
};

export default InputContainer;
