import React from 'react';

import { stateAbbrevToStateName } from '../../../../constants';

const PopupContent = (props) => {
  const {
    info: {
      state,
      forest,
      spots,
      spbPerTwoWeeks,
      cleridsPerTwoWeeks,
    },
  } = props;

  return (
    <div className="popup-content">
      <p><b>{stateAbbrevToStateName[state]}</b></p>
      <p><b>Forest: </b>{forest}</p>
      <p><b>Spots: </b>{spots}</p>
      <p><b>SPB: </b>{spbPerTwoWeeks}</p>
      <p><b>Clerids: </b>{cleridsPerTwoWeeks}</p>
    </div>
  );
};

export default PopupContent;
