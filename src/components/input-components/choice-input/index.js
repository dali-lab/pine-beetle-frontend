import React, { useState, useEffect } from 'react';
import '../style.scss';

const CLEAR_TEXT = 'Reset';

const ChoiceInput = (props) => {
  const {
    options,
    setValue,
    value,
    firstOptionText: initialFirstOptionText,
  } = props;

  const [firstOptionText, setFirstOptionText] = useState('');

  const submit = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    if (Array.isArray(value)) {
      setFirstOptionText(value.length > 0 ? CLEAR_TEXT : initialFirstOptionText);
    } else {
      setFirstOptionText(value ? CLEAR_TEXT : initialFirstOptionText);
    }
  }, [value, initialFirstOptionText]);

  const opts = [
    <option value="" key={firstOptionText}>{firstOptionText}</option>,
    ...options.filter((op) => !!op)
      .map((op) => <option value={op} key={op}>{op}</option>),
  ];

  return (
    <div className="selection-container">
      <select className="selection-button" onChange={submit} value={value}>
        {opts}
      </select>
    </div>
  );
};

export default ChoiceInput;
