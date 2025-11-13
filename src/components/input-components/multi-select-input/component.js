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
    if (valueChildren.length === 0 && valueParent) {
      // When valueChildren is empty and parent is selected, it means all counties are selected
      setStatusText(`${valueParent} (${optionsChildren.length} selected)`);
    } else if (valueChildren.length === 0) {
      setStatusText(CLEAR_TEXT);
    } else {
      setStatusText(valueParent ? `${valueParent} (${valueChildren.length} selected)` : CLEAR_TEXT);
    }
  }, [valueChildren, optionsChildren, valueParent]);

  useEffect(() => {
    // When parent changes, automatically select all children (empty array = all selected)
    if (valueParent) {
      setValueChildren([]);
    }
  }, [valueParent, setValueChildren]);

  const handleRemove = (element) => {
    setValueChildren(valueChildren.filter((e) => e !== element));
  };

  // set the parent and auto select all its children
  const selectParent = (parent) => {
    if (valueParent === parent) {
      setValueParent('');
      setIsListOpen(false);
    } else {
      setValueParent(parent);
      // Automatically select all children (empty array represents all selected)
      setValueChildren([]);
      setIsListOpen(false);
    }
  };

  // add children to value list or remove it if previously selected
  const selectChildren = (child) => {
    // When valueChildren is empty, it means all counties are selected
    const isAllSelected = valueChildren.length === 0;

    if (isAllSelected) {
      // If all are selected and user clicks one, deselect that one (select all except this one)
      // Convert from "all selected" to explicit list of all except the clicked one
      setValueChildren(optionsChildren.filter((c) => c !== child));
    } else if (valueChildren.indexOf(child) > -1) {
      // If child is already selected, remove it
      // But prevent deselecting all counties - if this would be the last one, keep it selected
      if (valueChildren.length === 1) {
        // Cannot deselect the last county, so do nothing
        return;
      }
      handleRemove(child);
    } else {
      // Add child to selection
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
              className={`location-list-item ${valueParent === item ? 'active' : ''}`}
              key={item}
            >
              <div
                className="location-list-item-select"
                onClick={() => selectParent(item)}
              >
                <div className="location-list-item-select-checkbox">
                  {valueParent === item ? <CheckboxChecked /> : <CheckboxEmpty />}
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
                      optionsChildren.map((child) => {
                        // When valueChildren is empty, all counties are selected
                        const isAllSelected = valueChildren.length === 0;
                        const isChildSelected = isAllSelected || valueChildren.indexOf(child) > -1;
                        return (
                          <div
                            className={`children-list-item ${isChildSelected ? 'active' : ''}`}
                            key={child}
                            onClick={() => selectChildren(child)}
                          >
                            <div className="children-list-item-checkbox">
                              {isChildSelected ? <CheckboxChecked /> : <CheckboxEmpty />}
                            </div>
                            {child}
                          </div>
                        );
                      })
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
        <div id="separation-line" />
        {locationList()}
      </div>
    );
  } else {
    return (
      <div className="multi-select-container" ref={ref}>
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
    );
  }
};

export default MultiSelectInput;
