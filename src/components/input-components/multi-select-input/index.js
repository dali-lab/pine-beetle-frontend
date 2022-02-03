/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
// import ArrowDown from '../../../assets/icons/arrow_down.svg';
import './style.scss';

const emptyCheckbox = require('../../../assets/icons/empty_checkbox.png');
const dashCheckbox = require('../../../assets/icons/dash_checkbox.png');
const selectedCheckbox = require('../../../assets/icons/selected_checkbox.png');

const CLEAR_TEXT = 'Select locations';

const MultiSelectInput = (props) => {
  const {
    title,
    type,
    valueParent,
    valueChildren,
    setValueParent,
    // setValueChildren,
    optionsParent,
    optionsChildren,
  } = props;

  const [statusText, setStatusText] = useState('');
  const [isListOpen, setIsListOpen] = useState(false);
  const [parent, setParent] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);

  // const submit = (event) => {
  //   if (event.target.value === '') {
  //     setValue('');
  //     setFirstOptionText(initialFirstOptionText);
  //   } else {
  //     setValue(event.target.value);
  //     setFirstOptionText(CLEAR_TEXT);
  //   }
  // };

  // const optsParent = [
  //   ...optionsParent.filter(op => !!op).map(op => (
  //     <option value={op} key={op}>{op}</option>
  //   )),
  // ];

  // const optsChildren = [
  //   ...optionsChildren.filter(op => !!op).map(op => (
  //     <option value={op} key={op}>{op}</option>
  //   )),
  // ];


  useEffect(() => {
    setStatusText(valueParent ? 'some selected' : CLEAR_TEXT);
  }, [valueParent, valueChildren]);

  const handleRemove = (element) => {
    const newValueList = selectedValues.filter(e => e !== element);
    setSelectedValues(newValueList);
    // setValueChildren(newValueList);
  };

  console.log('Counties: ', optionsChildren);
  return (
    <div className="multi-select-container">
      <label>{title}</label>
      <br />
      <div className="input-container">
        {/* Displays current type being displayed for children (e.g. counties or federal land) */}
        <div className="location-type">
          <p>{type}</p>
        </div>
        <div className="separation-line" />
        <div className="location-wrapper">
          <div className="location-header" onClick={() => { setIsListOpen(!isListOpen); }}>
            <div className="location-header-title">{statusText}</div>
          </div>
          {/* Initial dropdown displaying all parent data (e.g. all states) */}
          {isListOpen && (
            <div className="location-list">
              {optionsParent.map(item => (
                <div
                  className="location-list-item"
                  key={item}
                >
                  <div
                    className="location-list-item-select"
                    onClick={() => {
                      setParent(parent === item ? '' : item); // local
                      setValueParent(parent === item ? '' : item); // redux
                    }}
                  >
                    <img
                      src={parent === item ? dashCheckbox : emptyCheckbox}
                      alt="Parent checkbox"
                      className="location-list-item-select-checkbox"
                    />
                    {item}
                  </div>
                  {/* Second dropdown displaying all children data of a selected parent (e.g. counties of a state) */}
                  {parent === item && (
                  <div className="children-list">
                    {optionsChildren.map(child => (
                      <div
                        className="children-list-item"
                        key={child}
                        onClick={() => {
                          if (selectedValues.indexOf(child) > -1) {
                            handleRemove(child);
                          } else {
                            setSelectedValues([...selectedValues, child]);
                            // setValueChildren([...selectedValues, child]);
                          }
                          console.log('Selected values: ', selectedValues);
                        }}
                      >
                        <img
                          src={(selectedValues.indexOf(child) > -1) ? selectedCheckbox : emptyCheckbox}
                          alt="Child checkbox"
                          className="location-list-item-select-checkbox"
                        />
                        {child}
                        {' '}
                      </div>
                    ))}
                  </div>
                  )}
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
