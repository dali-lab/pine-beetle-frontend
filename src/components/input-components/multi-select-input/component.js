import React, { useEffect, useRef, useState } from 'react';

import './style.scss';

import closeIcon from '../../../assets/icons/close.png';

// SVG Checkbox Components
const CheckboxEmpty = () => (
  <svg className="checkbox-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#32454F" fill="white" />
  </svg>
);

const CheckboxChecked = () => (
  <svg className="checkbox-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="4" fill="#32454F" />
    <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CLEAR_TEXT = 'All Locations';

const MultiSelectInput = (props) => {
  const {
    id,
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
  }, [valueChildren, optionsChildren, valueParent]);

  // force "none selected" to be "all selected"
  useEffect(() => {
    if (!valueParent) {
      setAllSelected(true);
    }
  }, [valueParent]);

  useEffect(() => {
    setValueChildren([]);
  }, [setValueChildren]);

  const handleRemove = (element) => {
    setValueChildren(valueChildren.filter((e) => e !== element));
  };

  // set the parent and auto select all its children
  const selectParent = (parent) => {
    if (valueParent === parent) {
      setAllSelected(true);
      setValueParent('');
      setIsListOpen(false);
    } else {
      setAllSelected(false);
      setValueParent(parent);
      setIsListOpen(false);
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
              setAllSelected(true);
              setValueParent('');
            }}
          >
            Reset locations
          </button>
          {!listOnly
            && (
              <div className="close-icon">
                <img src={closeIcon} alt="close icon" onClick={() => setIsListOpen(false)} />
              </div>
            )}
        </div>
        {
          optionsParent.map((item) => (
            <div
              className={`location-list-item ${(valueParent === item || allSelected) ? 'active' : ''}`}
              key={item}
            >
              <div
                className="location-list-item-select"
                onClick={() => selectParent(item)}
              >
                <div className="location-list-item-select-checkbox">
                  {(valueParent === item || allSelected) ? <CheckboxChecked /> : <CheckboxEmpty />}
                </div>
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
                          className={`children-list-item ${(valueChildren.indexOf(child) > -1 || valueChildren.length === 0) ? 'active' : ''}`}
                          key={child}
                          onClick={() => selectChildren(child)}
                        >
                          <div className="children-list-item-checkbox">
                            {(valueChildren.indexOf(child) > -1 || valueChildren.length === 0) ? <CheckboxChecked /> : <CheckboxEmpty />}
                          </div>
                          {child}
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
            <div
              id={id}
              className="location-header"
              onClick={() => setIsListOpen(!isListOpen)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsListOpen(!isListOpen);
                }
              }}
              aria-expanded={isListOpen}
              aria-haspopup="listbox"
            >
              <div className="location-header-title">{statusText}</div>
              <svg
                className="location-header-arrow"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="#73767e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
