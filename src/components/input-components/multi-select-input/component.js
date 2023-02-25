/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import './style.scss';

import arrowDown from '../../../assets/icons/arrow-down.png';
import emptyCheckbox from '../../../assets/icons/empty_checkbox.png';
import selectedCheckbox from '../../../assets/icons/selected_checkbox.png';
// import { setAllStates } from '../../../state/actions';

const CLEAR_TEXT = 'Select location(s)';

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

  const ref = useRef();
  const [statusText, setStatusText] = useState('');
  const [allSelected, setAllSelected] = useState(true);
  const [isListOpen, setIsListOpen] = useState(false);

  // close dropdown when clicking outside the component
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (isListOpen && ref.current && !ref.current.contains(e.target)) {
        setIsListOpen(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [isListOpen]);

  useEffect(() => {
    if (valueChildren.length === 0) {
      setStatusText(valueParent ? `${valueParent} (${optionsChildren.length} selected)` : CLEAR_TEXT);
    } else {
      setStatusText(valueParent ? `${valueParent} (${valueChildren.length} selected)` : CLEAR_TEXT);
    }
  }, [valueChildren, optionsChildren]);

  useEffect(() => {
    setValueChildren([]);
  }, [valueParent]);

  const handleRemove = (element) => {
    setValueChildren(valueChildren.filter((e) => e !== element));
  };

  // set the parent and auto select all its children
  const selectParent = (parent) => {
    setAllSelected(false);
    if (valueParent === parent) {
      setValueParent('');
    } else {
      setValueParent(parent);
    }
  };

  // add children to value list or remove it if previously selected
  const selectChildren = (child) => {
    // if child has already been selected, then remove it
    if (valueChildren.indexOf(child) > -1) {
      handleRemove(child);
    } else {
      setValueChildren([...valueChildren, child]);
    }
  };

  const locationList = () => {
    return (
      <div className="location-list">
        <div className="location-list-header">
          <button type="button"
            className="location-list-instructions"
            onClick={() => {
              setAllSelected(!allSelected);
              setValueParent('');
            }}
          >
            {allSelected ? 'Unselect all' : 'Select all'}
          </button>
          <div className="location-list-clear" onClick={clearAllSelections}>clear</div>
        </div>
        {
          optionsParent.map((item) => (
            <div
              className="location-list-item"
              key={item}
            >
              <div
                className="location-list-item-select"
                onClick={() => selectParent(item)}
              >
                <img
                  src={(valueParent === item || allSelected) ? selectedCheckbox : emptyCheckbox}
                  alt="Parent checkbox"
                  className="location-list-item-select-checkbox"
                />
                {item}
                {valueParent === item && (
                  <span className="location-list-item-select-status">(
                    {
                      valueChildren.length === 0
                        ? optionsChildren.length
                        : valueChildren.length
                    } selected)
                  </span>
                )}
              </div>
              {/* Second dropdown displaying all children data of a selected parent (e.g. counties of a state) */}
              {
                valueParent === item && (
                  <div className="children-list">
                    {
                      optionsChildren.map((child) => (
                        <div
                          className="children-list-item"
                          key={child}
                          onClick={() => selectChildren(child)}
                        >
                          <img
                            src={(valueChildren.indexOf(child) > -1 || valueChildren.length === 0) ? selectedCheckbox : emptyCheckbox}
                            alt="Child checkbox"
                            className="location-list-item-select-checkbox"
                          />
                          {child}
                          {' '}
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </div>
          ))
        }
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
      <div className="multi-select-container" ref={ref}>
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
