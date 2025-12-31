import React, { useEffect, useRef, useState } from 'react';

import './style.scss';

import closeIcon from '../../../assets/icons/close.png';
import { CheckboxChecked, CheckboxEmpty, LocationHeaderArrowIcon } from './Icons';

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
  const previousOptionsChildrenRef = useRef(optionsChildren || []);

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
    if (optionsChildren?.length > 0) {
      previousOptionsChildrenRef.current = optionsChildren;
    }

    if (valueChildren.length === 0 && valueParent) {
      if (optionsChildren.length > 0) {
        setStatusText(`${valueParent} (${optionsChildren.length} selected)`);
      } else {
        setStatusText(valueParent);
      }
    } else if (valueChildren.length === 0) {
      setStatusText(CLEAR_TEXT);
    } else {
      setStatusText(valueParent ? `${valueParent} (${valueChildren.length} selected)` : CLEAR_TEXT);
    }
  }, [valueChildren, optionsChildren, valueParent]);

  useEffect(() => {
    if (valueParent) {
      setValueChildren([]);
    }
  }, [valueParent, setValueChildren]);

  const handleRemove = (element) => {
    setValueChildren(valueChildren.filter((e) => e !== element));
  };

  const selectParent = (parent) => {
    if (valueParent === parent) {
      setValueParent('');
      setIsListOpen(false);
    } else {
      setValueParent(parent);
      setValueChildren([]);
      setIsListOpen(false);
    }
  };

  const selectChildren = (child) => {
    const isAllSelected = valueChildren.length === 0;

    if (isAllSelected) {
      setValueChildren(optionsChildren.filter((c) => c !== child));
    } else if (valueChildren.indexOf(child) > -1) {
      if (valueChildren.length === 1) {
        return;
      }
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
                {valueParent === item && optionsChildren.length > 0 && (
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
          <LocationHeaderArrowIcon />
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
