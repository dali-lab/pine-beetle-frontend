import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

import { getStateAbbrevFromStateId } from './utils';

import './style.scss';

const StateMap = (props) => {
  const {
    setState,
  } = props;

  const [map, setMap] = useState();

  const handleUserStateClick = (stateId) => {
    const stateAbbreviation = getStateAbbrevFromStateId(stateId);

    if (stateAbbreviation) {
      setState(stateAbbreviation);
    }
  };

  const generateMap = () => {
    if (map) return;

    const createdMap = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-84.3880, 33.7490], // starting position
      zoom: 4.8, // starting zoom
      options: {
        trackResize: true,
      },
    });

    if (createdMap._controls) {
      // if we haven't added a navigation control, add one
      if (createdMap._controls.length < 3) {
        createdMap.addControl(new mapboxgl.NavigationControl());
      }

      // disable map zoom when using scroll
      createdMap.scrollZoom.disable();

      createdMap.on('load', () => {
        if (createdMap.getSource('states') === undefined) {
          // Add source for state polygons hosted on Mapbox, based on US Census Data:
          // https://www.census.gov/geo/maps-data/data/cbf/cbf_state.html
          createdMap.addSource('states', {
            type: 'vector',
            url: 'mapbox://mapbox.us_census_states_2015',
          });

          createdMap.addLayer({
            id: 'states-join',
            type: 'fill',
            source: 'states',
            'source-layer': 'states',
            paint: {
              'fill-opacity': 0,
            },
          }, 'waterway-label');
        }
      });

      // select state when user clicks on it
      createdMap.on('click', 'states-join', (e) => {
        handleUserStateClick(e.features[0].properties.STATE_ID);
      });

      setMap(createdMap);
    }
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
    generateMap();
  }, []);

  return (
    <div className="container" id="select-state-map">
      <div id="map" />
    </div>
  );
};

export default StateMap;
