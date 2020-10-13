/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import '../style.scss';

const CLEAR_TEXT = 'Clear Selection';

const ChoiceInput = (props) => {
  const {
    options,
    instructions,
    setValue,
    value,
    firstOptionText: initialFirstOptionText,
  } = props;

  const [firstOptionText, setFirstOptionText] = useState('');

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
    ...options.map(op => (
      <option value={op} key={op}>{op}</option>
    )),
  ];

  useEffect(() => {
    setFirstOptionText(value ? CLEAR_TEXT : initialFirstOptionText);
  }, [value, initialFirstOptionText]);

  return (
    <div className="selection">
      <label>{instructions}</label>
      <select className="selection-no-button" onChange={submit} value={value}>
        {opts}
      </select>
    </div>
  );
};

export default ChoiceInput;
