/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
// import ArrowDown from '../../../assets/icons/arrow_down.svg';
import './style.scss';

const CLEAR_TEXT = 'Select locations';

const MultiSelectInput = (props) => {
  const {
    title,
    type,
    valueParent,
    valueChildren,
    // setValueParent,
    // setValueChildren,
    optionsParent,
    // optionsChildren,
  } = props;

  const [statusText, setStatusText] = useState('');
  const [isListOpen, setIsListOpen] = useState(false);

  // const submit = (event) => {
  //   if (event.target.value === '') {
  //     setValue('');
  //     setFirstOptionText(initialFirstOptionText);
  //   } else {
  //     setValue(event.target.value);
  //     setFirstOptionText(CLEAR_TEXT);
  //   }
  // };

  const optsParent = [
    ...optionsParent.filter(op => !!op).map(op => (
      <option value={op} key={op}>{op}</option>
    )),
  ];

  // const optsChildren = [
  //   ...optionsChildren.filter(op => !!op).map(op => (
  //     <option value={op} key={op}>{op}</option>
  //   )),
  // ];


  useEffect(() => {
    setStatusText(valueParent ? 'some selected' : CLEAR_TEXT);
  }, [valueParent, valueChildren]);

  console.log('Raw states: ', optionsParent);
  console.log('States: ', optsParent);
  return (
    <div className="multi-select-container">
      <label>{title}</label>
      <br />
      <div className="input-container">
        <div className="location-type">
          <p>{type}</p>
        </div>
        <div className="separation-line" />
        <div className="location-wrapper">
          <div className="location-header" onClick={() => { setIsListOpen(!isListOpen); }}>
            <div className="location-header-title">{statusText}</div>
          </div>
          {isListOpen && (
            <div role="list" className="location-list">
              {optionsParent.map(item => (
                <div
                  className="location-list-item"
                  key={item}
                  onClick={() => console.log(item)}
                >
                  {item}
                  {' '}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelectInput;

/* <select className="selection-no-button" onChange={submit} value={value}>
{opts}
</select> */
