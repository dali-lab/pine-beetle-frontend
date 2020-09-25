/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import '../style.scss';

const TextInput = (props) => {
  const {
    instructions,
    setValue,
    value,
  } = props;

  return (
    <div className="menuInstruction">
      <label>{instructions}</label><br />
      <input
        className="input"
        type="text"
        name="fname"
        value={value}
        onChange={e => setValue(e.target.value)}
        onClick={e => e.target.select()}
      />
    </div>
  );
};

export default TextInput;
