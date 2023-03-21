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
      {instructions}
      <input
        className="input"
        type="text"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value, 10))}
      />
    </div>
  );
};

export default TextInput;
