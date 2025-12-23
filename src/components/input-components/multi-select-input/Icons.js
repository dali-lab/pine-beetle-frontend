import React from 'react';

export const CheckboxEmpty = () => (
  <svg
    className="checkbox-icon"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.5"
      y="0.5"
      width="19"
      height="19"
      rx="3.5"
      stroke="#32454F"
      fill="white"
    />
  </svg>
);

export const CheckboxChecked = () => (
  <svg
    className="checkbox-icon"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="20" rx="4" fill="#32454F" />
    <path
      d="M6 10L9 13L14 7"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LocationHeaderArrowIcon = () => (
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
);
