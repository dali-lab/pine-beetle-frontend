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
    clearAllSelections,
    valueParent,
    valueChildren,
    setValueParent,
    setValueChildren,
    optionsParent,
    optionsChildren,
    listOnly,
  } = props;

  const [statusText, setStatusText] = useState('');
  const [isListOpen, setIsListOpen] = useState(false);

  useEffect(() => {
    if (valueChildren.length === 0) {
      setStatusText(valueParent ? `${valueParent} selected` : CLEAR_TEXT);
    } else {
      setStatusText(valueParent ? `${valueParent}: ${valueChildren.length} selected` : CLEAR_TEXT);
    }
  }, [valueChildren]);

  useEffect(() => {
    setValueChildren([]);
  }, [valueParent]);

  const handleRemove = (element) => {
    setValueChildren(valueChildren.filter(e => e !== element));
  };

  const locationList = () => {
    return (
      <div className="location-list">
        <div className="location-list-header">
          <p className="location-list-instructions">Select location(s)</p>
          <div className="location-list-clear" onClick={() => clearAllSelections()}>clear</div>
        </div>
        {optionsParent.map(item => (
          <div
            className="location-list-item"
            key={item}
          >
            <div
              className="location-list-item-select"
              onClick={() => setValueParent(valueParent === item ? '' : item)}
            >
              <img
                src={valueParent === item ? dashCheckbox : emptyCheckbox}
                alt="Parent checkbox"
                className="location-list-item-select-checkbox"
              />
              {item}
              {valueParent === item && <span className="location-list-item-select-status">({valueChildren.length} selected)</span>}
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
    );
  };

  if (listOnly) {
    return (
      <div className="multi-select-container">
        <div className="input-container">
          <div className="location-wrapper">
            <div id="separation-line" />
            {locationList()}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="multi-select-container">
        <div className="input-container">
          <div className="location-wrapper">
            <div className="location-header" onClick={() => setIsListOpen(!isListOpen)}>
              <div className="location-header-title">{statusText}</div>
              <img
                src={arrowDown}
                alt="Arrow down"
                className="location-header-arrow"
              />
            </div>
            {/* Initial dropdown displaying all parent data (e.g. all states) */}
            {isListOpen && (
              locationList()
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default MultiSelectInput;
