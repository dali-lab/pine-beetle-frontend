import React from 'react';

const Map = (props) => {
  const {
    hover,
  } = props;

  return (
    <>
      <div id="map" />
      {hover}
    </>
  );
};

export default Map;
