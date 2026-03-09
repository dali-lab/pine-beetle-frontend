import React from 'react';

import { Button } from '../../../../components';
import { ChoiceInput } from '../../../../components/input-components';

import './style.scss';

const MODEL_VERSION_FIRST_YEAR = 2025;

const PlayWithModelInputs = (props) => {
  const {
    modelInputs,
    runModel,
    updateModelInputs,
    year,
    defaultModelVersion,
  } = props;

  const createValueSetter = (fieldName) => (newValue) => {
    updateModelInputs({
      [fieldName]: newValue,
    });
  };

  const INPUT_INFORMATION = {
    SPOTST2: {
      text: 'Enter number of spots two years ago',
      value: parseInt(modelInputs.spotst2, 10),
      setValue: createValueSetter('spotst2'),
      trueFalseSelection: false,
    },
    SPOTST1: {
      text: 'Enter number of spots in previous year',
      value: parseInt(modelInputs.spotst1, 10),
      setValue: createValueSetter('spotst1'),
      trueFalseSelection: false,
    },
    CLERIDST1: {
      text: 'Enter number of clerids / 2 weeks / trap this spring (leave blank if unknown)',
      value: parseInt(modelInputs.cleridst1, 10),
      setValue: createValueSetter('cleridst1'),
      trueFalseSelection: false,
    },
    SPB: {
      text: 'Enter number of SPB / 2 weeks / trap this spring',
      value: parseInt(modelInputs.spb, 10),
      setValue: createValueSetter('spb'),
      trueFalseSelection: false,
    },
    ENDOBREV: {
      text: 'Toggle this switch to "No" if endo-brevicomin was not used',
      value: modelInputs.endobrev,
      setValue: createValueSetter('endobrev'),
      trueFalseSelection: true,
    },
  };

  const MODEL_VERSION_INPUTS = {
    2018: ['SPOTST2', 'SPOTST1', 'CLERIDST1', 'SPB', 'ENDOBREV'],
    2024: ['SPOTST1', 'SPB', 'ENDOBREV'],
    2025: ['SPOTST2', 'SPOTST1', 'SPB', 'ENDOBREV'],
  };

  const filterModelVersionInputs = (modelVersion) => {
    const inputsForVersion = MODEL_VERSION_INPUTS[modelVersion] ?? MODEL_VERSION_INPUTS[defaultModelVersion];
    const filteredInputsInformation = Object.entries(INPUT_INFORMATION).filter((entry) => {
      return inputsForVersion.includes(entry[0]);
    });

    return Object.fromEntries(filteredInputsInformation);
  };

  const inputInformation = filterModelVersionInputs(modelInputs.modelVersion);

  const modelVersionOptions = [
    2018,
    2024,
    ...Array.from(
      { length: Math.max(0, new Date().getFullYear() - MODEL_VERSION_FIRST_YEAR + 1) },
      (_, i) => MODEL_VERSION_FIRST_YEAR + i
    ),
  ];

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
            <div className={`endobrev-checkbox ${value ? 'selected' : ''}`} onClick={() => setValue(true)}>
              <div className="custom-checkbox">
                <div className="checkbox-indicator">
                  {value && <span className="checkmark">✓</span>}
                </div>
                <span>Yes</span>
              </div>
            </div>
            <div className={`endobrev-checkbox ${!value ? 'selected' : ''}`} onClick={() => setValue(false)}>
              <div className="custom-checkbox">
                <div className="checkbox-indicator">
                  {!value && <span className="checkmark">✓</span>}
                </div>
                <span>No</span>
              </div>
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
          <span className="input-description">Change numbers in any of the fields below to gauge effect on predicted risks at right</span>
          <span className="required-text">* required</span>
        </div>
        {Object.entries(inputInformation).map(([key, inputInfo]) => {
          const {
            text,
            value,
            setValue,
            trueFalseSelection,
          } = inputInfo;

          return (
            <div className="field" key={key}>
              <div className="field-text-container">
                <div id="field-text">
                  {text
                    .replace('{YEAR}', year)
                    .replace('{YEAR-1}', year - 1)
                    .replace('{YEAR-2}', year - 2)}
                  {key !== 'CLERIDST1'
                    ? <span className="required-text"> *</span>
                    : <span className="required-text"> (optional)</span>}
                </div>
              </div>
              {selectionInput(trueFalseSelection, value, setValue)}
            </div>
          );
        })}
      </div>
      <div className="actions-container">
        <div className="pick-model-input">
          <span>Pick model version</span>
          <ChoiceInput
            id="modelVersion"
            options={modelVersionOptions}
            value={modelInputs.modelVersion}
            setValue={createValueSetter('modelVersion')}
            firstOptionText="Year"
          />
        </div>
        <Button className="run-button" onClick={runModel}>
          Run
        </Button>
      </div>
    </div>
  );
};

export default PlayWithModelInputs;
