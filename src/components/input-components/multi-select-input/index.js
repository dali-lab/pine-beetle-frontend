/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import './style.scss';

const arrowDown = require('../../../assets/icons/arrow-down.png');
const emptyCheckbox = require('../../../assets/icons/empty_checkbox.png');
const dashCheckbox = require('../../../assets/icons/dash_checkbox.png');
const selectedCheckbox = require('../../../assets/icons/selected_checkbox.png');

const CLEAR_TEXT = 'Select locations';

const MultiSelectInput = (props) => {
  const {
    valueParent,
    valueChildren,
    setValueParent,
    setValueChildren,
    optionsParent,
    optionsChildren,
  } = props;

  const [statusText, setStatusText] = useState('');
  const [isListOpen, setIsListOpen] = useState(false);

  useEffect(() => {
    setStatusText(valueParent ? 'some selected' : CLEAR_TEXT);
  }, [valueChildren]);

  useEffect(() => {
    setValueChildren([]);
  }, [valueParent]);

  const handleRemove = (element) => {
    const newValueList = valueChildren.filter(e => e !== element);
    setValueChildren(newValueList);
  };

  return (
    <div className="multi-select-container"> {/* Clean CSS */}
      <div className="input-container">
        <div className="location-wrapper">
          <div className="location-header" onClick={() => { setIsListOpen(!isListOpen); }}>
            <div className="location-header-title">{statusText}</div>
            <img
              src={arrowDown}
              alt="Arrow down"
              className="location-header-arrow"
            />
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
                      setValueParent(valueParent === item ? '' : item); // redux
                    }}
                  >
                    <img
                      src={valueParent === item ? dashCheckbox : emptyCheckbox}
                      alt="Parent checkbox"
                      className="location-list-item-select-checkbox"
                    />
                    {item}
                  </div>
                  {/* Second dropdown displaying all children data of a selected parent (e.g. counties of a state) */}
                  {valueParent === item && (
                  <div className="children-list">
                    {optionsChildren.map(child => (
                      <div
                        className="children-list-item"
                        key={child}
                        onClick={() => {
                          if (valueChildren.indexOf(child) > -1) {
                            handleRemove(child);
                          } else {
                            setValueChildren([...valueChildren, child]);
                          }
                        }}
                      >
                        <img
                          src={(valueChildren.indexOf(child) > -1) ? selectedCheckbox : emptyCheckbox}
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
