/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import '../style.scss';

const CLEAR_TEXT = 'Clear Selection';

const ChoiceInput = (props) => {
  const {
    options,
    instructions,
    setValue,
    value,
    isMulti,
    firstOptionText: initialFirstOptionText,
  } = props;

  const [firstOptionText, setFirstOptionText] = useState('');
  const [multiValue, setMultiValue] = useState(isMulti ? [] : null);

  const submit = (event) => {
    if (event.target.value === '') {
      setValue('');
      setFirstOptionText(initialFirstOptionText);
    } else {
      setValue(event.target.value);
      setFirstOptionText(CLEAR_TEXT);
    }
  };

  const opts = [
    <option value="" key={firstOptionText}>{firstOptionText}</option>,
    ...options.filter(op => !!op).map(op => (
      <option value={op} key={op}>{op}</option>
    )),
  ];

  const multiOpts = options.filter(op => !!op).map(op => (
    { label: op, value: op }
  ));

  const vals = multiValue ? multiValue.map(v => (
    v.value
  )) : null;

  useEffect(() => {
    setFirstOptionText(value ? CLEAR_TEXT : initialFirstOptionText);
  }, [value, initialFirstOptionText]);

  useEffect(() => {
    if (isMulti) {
      console.log('Multi updated');
      console.log(vals);
      setValue(vals); // currently sets county to be this array, but then the state resets and the remaining options are hidden
    }
  }, [multiValue]);

  return (
    <div className="selection">
      <label>{instructions}</label>
      <br />
      {isMulti ? (
        <MultiSelect
          options={multiOpts}
          value={multiValue}
          onChange={setMultiValue}
          labelledBy="Select"
        />
      ) : (
        <select className="selection-no-button" onChange={submit} value={value}>
          {opts}
        </select>
      )}
    </div>
  );
};

export default ChoiceInput;
