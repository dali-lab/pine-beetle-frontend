/*
 * DEV NOTE, Jeff Liu 2023:
 * this and the other map (prediction & trapping) should be rewritten
 * in the future and refactored to use composition. there's tons of
 * code duplication that can be combined so bug fixes are unified.
 *
 * also, there's a whole bunch of weird things based on switching the map
 * between county and federal land mode. I think a map subcomponent should be made
 * and there should be two different ones for county and RD that look at different fields.
 */

/* eslint-disable prefer-destructuring */
import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

import {
  DATA_MODES,
  SOURCE_LAYERS,
  MAP_SOURCE_NAME,
  VECTOR_LAYER,
  STATE_VECTOR_LAYER,
  MAP_TYPES,
} from '../../../../constants';

import {
  createHoverCallback,
  createMapClickCallback,
  downloadMap,
  generateMap,
  getMapboxRDNameFormat,
  zoomToSelectedState,
} from '../../../../utils';
import { api } from '../../../../services';

import {
  thresholds,
  colors,
} from './constants';

import './style.scss';
import { Map } from '../../../../components';

const HistoricalMap = (props) => {
  const {
    availableStates,
    availableSublocations,
    dataMode,
    endYear,
    selectedState,
    setCounty,
    setRangerDistrict,
    setState,
    startYear,
    sublocationData: rawData,
  } = props;

  const [map, setMap] = useState();
  const [initialFill, setInitialFill] = useState(false);
  const [legendTags, setLegendTags] = useState([]);
  const [trappingHover, setTrappingHover] = useState(null);
  const [isDownloadingMap, setIsDownloadingMap] = useState(false);
  const [mapClickCallback, setMapClickCallback] = useState();
  const [mapHoverCallback, setMapHoverCallback] = useState();
  const [mapStateClickCallback, setMapStateClickCallback] = useState();
  const [mapLayerMouseLeaveCallback, setMapLayerMouseLeaveCallback] = useState();
  const [allRangerDistricts, setAllRangerDistricts] = useState([]);

  useEffect(() => {
    if (dataMode === DATA_MODES.RANGER_DISTRICT) {
      api.getAvailableSublocations(dataMode)
        .then(setAllRangerDistricts)
        .catch(console.error);
    }
  }, [dataMode]);

  const createMapHoverCallback = (allData, rangerDistricts, mode, state, availStates) => {
    const callback = (hoverState, location, x, y, counties) => {
      const sublocation = mode === DATA_MODES.COUNTY ? 'county' : 'rangerDistrict';

      const data = allData.filter((p) => {
        return (
        // either ranger district mode or have a matching state
          (mode === DATA_MODES.RANGER_DISTRICT || ((p.state === hoverState && p.state === state) || (!state && availStates.includes(hoverState))))
      // and sublocation matches
      && ((p[sublocation] === location))
        );
      }).filter((p) => p.state === hoverState || mode === DATA_MODES.RANGER_DISTRICT);

      if (data && data.length > 0 && x && y) {
        const {
          sumSpotst0,
          county: countyName,
        } = data[0];

        const isInvalidNumber = (num) => Number.isNaN(num) || num === null || num === undefined;

        setTrappingHover((
          <div id="trapping-hover" style={{ left: `${x + 10}px`, top: `${y - 140}px` }}>
            <h3>{dataMode === DATA_MODES.COUNTY ? `${countyName} County` : `${counties[0].properties.forest.slice(0, -3)} Ranger District`}</h3>
            {!isInvalidNumber(sumSpotst0) ? <p>Spots: {sumSpotst0}</p> : null}
          </div>
        ));
      } else {
        setTrappingHover(null);
      }
    };

    return createHoverCallback(map, rangerDistricts, dataMode, callback);
  };

  const colorFill = (d) => {
    // keep trying until map styles are loaded
    if (!map.isStyleLoaded()) {
      setTimeout(() => {
        colorFill(d);
      }, 1000);

      return;
    }

    // remove county layer if already constructed
    if (map.getLayer(VECTOR_LAYER)) {
      map.removeLayer(VECTOR_LAYER);
    }

    const fillExpression = ['match', ['upcase', ['get', 'forest']]];
    const strokeExpression = ['match', ['upcase', ['get', 'forest']]];

    const trappingsByLocality = d.reduce((acc, curr) => {
      const {
        county,
        rangerDistrict,
        state,
        sumSpotst0,
      } = curr;

      const countyFormatName = `${county} ${state}`.toUpperCase();
      const rangerDistrictFormatName = rangerDistrict ? getMapboxRDNameFormat(rangerDistrict)?.toUpperCase() : '';

      const localityDescription = dataMode === DATA_MODES.COUNTY ? countyFormatName : rangerDistrictFormatName;
      // for some reason the below code doesn't work, despite that it's supposed to be more robust for a couple of places like Holly Springs
      // const localityDescription = dataMode === DATA_MODES.COUNTY
      //   ? countyFormatName
      //   // handles case where tileset has two spaces instead of one (this is a one-off), or is missing the word RD altogether (also one-off)
      //   : [rangerDistrictFormatName, rangerDistrictFormatName.replace(' RD', '  RD'), rangerDistrictFormatName.replace(' RD', '')]
      //     .filter((str) => !!str);

      return {
        ...acc,
        [localityDescription]: sumSpotst0,
      };
    }, {});

    Object.entries(trappingsByLocality).forEach(([localityDescription, sumSpotst0]) => {
      let color;

      if (sumSpotst0 === null) {
        color = colors[0];
      } else if (sumSpotst0 < 10) {
        color = colors[1];
      } else if (sumSpotst0 < 20) {
        color = colors[2];
      } else if (sumSpotst0 < 50) {
        color = colors[3];
      } else if (sumSpotst0 < 100) {
        color = colors[4];
      } else if (sumSpotst0 < 250) {
        color = colors[5];
      } else {
        color = colors[6];
      }

      fillExpression.push(localityDescription, color);
      strokeExpression.push(localityDescription, '#000000');
    });

    // last value is the default, used where there is no data
    fillExpression.push('rgba(0,0,0,0)');
    strokeExpression.push('rgba(0,0,0,0)');

    // add layer from the vector tile source with data-driven style
    map.addLayer({
      id: VECTOR_LAYER,
      type: 'fill',
      source: MAP_SOURCE_NAME,
      'source-layer': dataMode === DATA_MODES.COUNTY ? SOURCE_LAYERS.COUNTY : SOURCE_LAYERS.RANGER_DISTRICT,
      paint: {
        'fill-color': fillExpression,
        'fill-outline-color': strokeExpression,
      },
    }, 'water-point-label');
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
    const clickCallback = createMapClickCallback(availableStates, availableSublocations, selectedState, rawData, dataMode, props.county, setCounty, props.rangerDistrict, setRangerDistrict);
    const hoverCallback = createMapHoverCallback(rawData, allRangerDistricts, dataMode, selectedState, availableStates);

    setTimeout(() => {
      setMap(undefined);
      generateMap(true, map, thresholds, colors, setLegendTags, dataMode, clickCallback, setMapClickCallback, hoverCallback, setMapHoverCallback, setMap);

      // Calls function to download map when download control is clicked
      document.addEventListener('click', (event) => {
        if (!event.target.matches('.download-button')) return;
        downloadMap(
          map,
          endYear,
          isDownloadingMap,
          setIsDownloadingMap,
          selectedState,
          MAP_TYPES.HISTORICAL,
          { titleDetails: { selectedState, period: `${startYear}-${endYear}` }, thresholds, colors },
        );
      }, false);

      // Calls function to download map when download control is clicked
      document.addEventListener('click', (event) => {
        if (!event.target.matches('.download-button p')) return;
        downloadMap(
          map,
          endYear,
          isDownloadingMap,
          setIsDownloadingMap,
          selectedState,
          MAP_TYPES.HISTORICAL,
          { titleDetails: { selectedState, period: `${startYear}-${endYear}` }, thresholds, colors },
        );
      }, false);
    }, 100);
  }, [dataMode]);

  useEffect(() => {
    if (!map) return;

    if (endYear.toString().length === 4) colorFill(rawData);

    zoomToSelectedState(selectedState, map);
  }, [rawData, selectedState, map]); // endYear can prob be added. colorFill needs useCallback

  useEffect(() => {
    if (!initialFill && map && rawData.length > 0) {
      colorFill(rawData);
      setInitialFill(true);
    }

    if (map && rawData) {
      // remove current callback
      if (mapHoverCallback) map.off('mousemove', mapHoverCallback);

      // generate new callback
      const callback = createMapHoverCallback(rawData, allRangerDistricts, dataMode, selectedState, availableStates);
      setMapHoverCallback(() => callback);
      map.on('mousemove', callback);
    }
  }, [
    map,
    rawData,
    allRangerDistricts,
    availableSublocations,
    dataMode,
    selectedState,
    availableStates,
  ]); // same thing with colorFill, createMapHoverCallback complicated

  useEffect(() => {
    if (map && availableStates && availableSublocations) {
      // remove current callback
      if (mapClickCallback) map.off('click', VECTOR_LAYER, mapClickCallback);

      // generate new callback
      const callback = createMapClickCallback(availableStates, availableSublocations, selectedState, rawData, dataMode, props.county, setCounty, props.rangerDistrict, setRangerDistrict);
      setMapClickCallback(() => callback);
      map.on('click', VECTOR_LAYER, callback);
    }
  }, [
    map,
    availableStates,
    availableSublocations,
    selectedState,
    rawData,
    dataMode,
  ]);

  useEffect(() => {
    if (map) {
      // remove current callback
      if (mapStateClickCallback) map.off('click', STATE_VECTOR_LAYER, mapStateClickCallback);

      // generate new callback
      const callback = (e) => {
        const { abbrev } = e?.features[0]?.properties || {};

        // state must exist, not be current selection and must be a valid state
        if (abbrev && selectedState !== abbrev && availableStates.includes(abbrev)) {
          setState(abbrev);
        }
      };

      setMapStateClickCallback(() => callback);
      map.on('click', STATE_VECTOR_LAYER, callback);
    }
  }, [map, availableStates, selectedState]);

  useEffect(() => {
    if (map) {
      // remove current callback
      if (mapLayerMouseLeaveCallback) map.off('click', VECTOR_LAYER, mapLayerMouseLeaveCallback);

      // generate new callback
      const callback = () => setTrappingHover(null);

      setMapLayerMouseLeaveCallback(() => callback);
      map.on('mouseleave', VECTOR_LAYER, callback);
    }
  }, [map]);

  useEffect(() => {
    if (rawData.length === 0 && map && map.getLayer(VECTOR_LAYER)) {
      map.removeLayer(VECTOR_LAYER);
    }
  }, [rawData]);

  return (
    <div id="trapping-map-container">
      <Map
        hover={trappingHover}
        legend={(
          <>
            <div className="legend-key-title">Total Number of Spots</div>
            {legendTags}
          </>
              )}
        downloadCallback={() => downloadMap(
          map,
          endYear,
          isDownloadingMap,
          setIsDownloadingMap,
          selectedState,
          MAP_TYPES.HISTORICAL,
          { titleDetails: { selectedState, period: `${startYear}-${endYear}` }, thresholds, colors },
        )}
        isDownloadingMap={isDownloadingMap}
      />
    </div>
  );
};

export default HistoricalMap;
