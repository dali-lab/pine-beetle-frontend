/* eslint-disable prefer-destructuring */
import React from 'react';

const Pin = (props) => {
  const {
    object: {
      spots,
    },
    colors,
    size = 20,
    onClick,
  } = props;

  const pinStyle = {
    cursor: 'pointer',
    fill: '#1f77b4',
    stroke: '#fff',
    overflow: 'visible',
  };

  if (spots >= 0 && spots <= 100) {
    pinStyle.fill = colors[0];
  } else if (spots > 100 && spots <= 250) {
    pinStyle.fill = colors[1];
  } else if (spots > 250 && spots <= 500) {
    pinStyle.fill = colors[2];
  } else if (spots > 500 && spots <= 750) {
    pinStyle.fill = colors[3];
  } else if (spots > 750 && spots <= 1000) {
    pinStyle.fill = colors[4];
  } else if (spots > 1000 && spots <= 2500) {
    pinStyle.fill = colors[5];
  } else if (spots > 2500 && spots <= 5000) {
    pinStyle.fill = colors[6];
  } else if (spots > 5000 && spots <= 10000) {
    pinStyle.fill = colors[7];
  } else if (spots > 10000) {
    pinStyle.fill = colors[8];
  }

  return (
    <svg
      height={size}
      viewBox="0 0 24 24"
      style={{ ...pinStyle, transform: `translate(${-size / 2}px,${-size}px)` }}
      onClick={onClick}
    >
      <circle r="9" />
    </svg>
  );
};

export default Pin;
