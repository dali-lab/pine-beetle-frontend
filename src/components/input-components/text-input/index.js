/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
// import '../style.scss';

const TextInput = (props) => {
  const {
    instructions,
    setValue,
    value,
  } = props;

  return (
    <div className="menuInstruction">
      <label>{instructions}</label>
      <input
        className="input"
        type="text"
        value={value}
        onChange={e => setValue(parseInt(e.target.value, 10) || '')}
      />
    </div>
  );
};

export default TextInput;
