import React, { useEffect, useRef, useState } from 'react';
import '../style.scss';

const CLEAR_TEXT = 'Reset';

const ChoiceInput = (props) => {
  const {
    id,
    options,
    setValue,
    value,
    firstOptionText: initialFirstOptionText,
  } = props;

  const [firstOptionText, setFirstOptionText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (isOpen && ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (Array.isArray(value)) {
      setFirstOptionText(value.length > 0 ? CLEAR_TEXT : initialFirstOptionText);
    } else {
      setFirstOptionText(value ? CLEAR_TEXT : initialFirstOptionText);
    }
  }, [value, initialFirstOptionText]);

  const handleSelect = (option) => {
    setValue(option);
    setIsOpen(false);
  };

  const displayText = value || firstOptionText || 'Select an option';
  const filteredOptions = options.filter((op) => !!op);

  return (
    <div className="choice-input-wrapper" ref={ref}>
      <div
        id={id}
        className="choice-input-button"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={`choice-input-text ${!value ? 'placeholder' : ''}`}>
          {displayText}
        </span>
        <svg
          className={`choice-input-arrow ${isOpen ? 'open' : ''}`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="choice-input-dropdown">
          {!value && firstOptionText && (
            <div
              className="choice-input-option reset-option"
              onClick={() => handleSelect('')}
              role="option"
              aria-selected={!value}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect('');
                }
              }}
            >
              {firstOptionText}
            </div>
          )}
          {filteredOptions.map((option) => (
            <div
              key={option}
              className={`choice-input-option ${value === option ? 'selected' : ''}`}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={value === option}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(option);
                }
              }}
            >
              {option}
              {value === option && (
                <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L6.5 11.5L13 4.5" stroke="#4F772D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChoiceInput;
