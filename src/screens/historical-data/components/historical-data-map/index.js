import React, { useState, useEffect } from 'react';
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';

import Pin from './pin';
import PopupContent from './popup-content';

import './style.scss';

console.log(process.env.MAPBOX_ACCESS_TOKEN);

const HistoricalDataMap = (props) => {
  const {
    summarizedDataByLatLong = [],
  } = props;

  const navStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '10px',
  };

  const thresholds = ['0-100', '100-250', '250-500', '500-750', '750-1,000', '1,000-2,000', '2,000-5,000', '5,000-10,000', '10,000+'];
  const colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026', '#4F0017'];

  const legendTags = colors.map((color, index) => {
    const layer = thresholds[index];
    return (
      <div key={color}>
        <span className="legend-key" style={{ backgroundColor: color }} />
        <span>{layer}</span>
      </div>
    );
  });

  const [viewport, setViewport] = useState({
    width: ((window.innerWidth - 62) * 0.50),
    height: 800,
    latitude: 33.7490,
    longitude: -84.3880,
    zoom: 4.8,
    bearing: 0,
    pitch: 0,
  });

  const [popupInfo, setPopupInfo] = useState();

  const updateMapDimensions = () => {
    setViewport({
      ...viewport,
      width: ((window.innerWidth - 62) * 0.50),
    });
  };

  const renderMarker = (object, index) => {
    // change selection based on what user clicked on here
    return (
      <Marker
        key={`marker-${index}`}
        longitude={object.longitude}
        latitude={object.latitude}
      >
        <Pin size={20} onClick={() => setPopupInfo(object)} object={object} numObjects={summarizedDataByLatLong.length} colors={colors} />
      </Marker>
    );
  };

  // add event listener for window resize
  useEffect(() => {
    window.addEventListener('resize', updateMapDimensions); // add resize event listener
    return () => window.removeEventListener('resize', updateMapDimensions);
  }, []);

  const renderPopup = () => {
    return popupInfo && (
    <Popup tipSize={4}
      anchor="top"
      longitude={popupInfo.longitude}
      latitude={popupInfo.latitude}
      closeOnClick={false}
      onClose={() => setPopupInfo(null)}
    >
      <PopupContent info={popupInfo} />
    </Popup>
    );
  };

  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={setViewport}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxApiAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
      scrollZoom={false}
      onClick={() => {}}
    >
      <div className="nav" style={navStyle}>
        <NavigationControl
          onViewportChange={setViewport}
          captureScroll={false}
          showCompass={false}
        />
      </div>

      <div className="map-overlay-legend" id="legend-hist">
        {legendTags}
      </div>

      { summarizedDataByLatLong.map(renderMarker) }
      {renderPopup()}

    </ReactMapGL>
  );
};

export default HistoricalDataMap;
