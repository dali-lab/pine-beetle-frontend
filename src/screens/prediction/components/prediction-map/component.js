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
import mapboxgl from 'mapbox-gl';
import React, { useEffect, useState } from 'react';

import {
  DATA_MODES,
  MAP_SOURCE_NAME,
  MAP_TITLES,
  SOURCE_LAYERS,
  STATE_VECTOR_LAYER,
  VECTOR_LAYER,
} from '../../../../constants';

import { api } from '../../../../services';
import {
  createHoverCallback,
  createMapClickCallback,
  downloadMap,
  generateMap,
  getFillColor,
  getMapboxRDNameFormat,
  mapboxHoverStyle,
  zoomToSelectedState,
} from '../../../../utils';

import {
  colors,
  thresholds,
} from './constants';

import './style.scss';

import { LegendOverlay, Map } from '../../../../components';
import TogglesOverlay from '../../../../components/map/components';
import { isInvalidNumber } from '../../../../utils/map';

const PredictionMap = (props) => {
  const {
    availableStates,
    availableSublocations,
    data,
    dataMode,
    selectedState,
    setCounty,
    setRangerDistrict,
    setState,
    setPredictionModal,
    year,
  } = props;

  const [map, setMap] = useState();
  const [initialFill, setInitialFill] = useState(false);
  const [predictionHover, setPredictionHover] = useState(null);
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

  const createMapHoverCallback = (predictions, rangerDistricts, mode, state, availStates) => {
    const callback = (hoverState, location, x, y) => {
      const pred = predictions.find((p) => {
      // either ranger district mode or have a matching state
        return (mode === DATA_MODES.RANGER_DISTRICT || (p.state === hoverState && p.state === state) || (!state && availStates.includes(hoverState)))
              // and sublocation matches
              && ((p.county === location && mode === DATA_MODES.COUNTY && p.state === hoverState) || (p.rangerDistrict === location && mode === DATA_MODES.RANGER_DISTRICT));
      });

      if (pred && x && y) {
        const {
          county: countyName,
          probSpotsGT0: probAny,
          probSpotsGT50: probOutbreak,
        } = pred;

        setPredictionHover((
          <div id="prediction-hover" style={mapboxHoverStyle(x, y)}>
            <h3>{dataMode === DATA_MODES.COUNTY ? `${countyName} County` : `${getMapboxRDNameFormat(location).slice(0, -3)} Ranger District`}</h3>
            <p>Probability of any spots: {isInvalidNumber(probAny) ? 'null' : (probAny * 100).toFixed(1)}%</p>
            <p>Probability of an outbreak: {isInvalidNumber(probOutbreak) ? 'null' : (probOutbreak * 100).toFixed(1)}%</p>
          </div>
        ));
      } else {
        setPredictionHover(null);
      }
    };

    return createHoverCallback(map, rangerDistricts, dataMode, callback);
  };

  const colorPredictions = (predictions) => {
    // keep trying until map styles are loaded
    if (!map.isStyleLoaded()) {
      setTimeout(() => {
        colorPredictions(predictions);
      }, 1000);

      return;
    }

    // remove county layer if already constructed
    if (map.getLayer(VECTOR_LAYER)) {
      map.removeLayer(VECTOR_LAYER);
    }

    const fillExpression = ['match', ['upcase', ['get', 'forest']]];
    const strokeExpression = ['match', ['upcase', ['get', 'forest']]];

    predictions.forEach(({
      county,
      probSpotsGT50: fillProb,
      rangerDistrict,
      state,
    }) => {
      const color = getFillColor(fillProb).color;

      const countyFormatName = county && state ? `${county.toUpperCase()} ${state}` : '';
      const rangerDistrictFormatName = rangerDistrict ? getMapboxRDNameFormat(rangerDistrict).toUpperCase() : '';

      const locationName = dataMode === DATA_MODES.COUNTY
        ? countyFormatName
        // handles case where tileset has two spaces instead of one (this is a one-off), or is missing the word RD altogether (also one-off)
        : [rangerDistrictFormatName, rangerDistrictFormatName.replace(' RD', '  RD'), rangerDistrictFormatName.replace(' RD', '')]
          .filter((str) => !!str);

      if (locationName?.length !== 0) {
        fillExpression.push(locationName, color);
        strokeExpression.push(locationName, '#000000');
      }
    });

    // last value is the default, used where there is no data
    fillExpression.push('rgba(0,0,0,0)');
    strokeExpression.push('rgba(0,0,0,0)');

    // add layer from the vector tile source with data-driven style
    // double-checking if we have valid fillExpression for paint
    if (fillExpression.length > 3) {
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
    }
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
    const clickCallback = createMapClickCallback(
      availableStates,
      availableSublocations,
      selectedState,
      data,
      dataMode,
      props.county,
      setCounty,
      props.rangerDistrict,
      setRangerDistrict,
    );
    const hoverCallback = createMapHoverCallback(
      data,
      allRangerDistricts,
      dataMode,
      selectedState,
      availableStates,
    );

    setTimeout(() => {
      setMap(undefined);
      generateMap(
        true,
        map,
        thresholds,
        colors,
        () => {}, // No-op function since we use LegendOverlay instead
        dataMode,
        clickCallback,
        setMapClickCallback,
        hoverCallback,
        setMapHoverCallback,
        setMap,
      );
    }, 100);
  }, [dataMode]);

  useEffect(() => {
    if (!map) return;

    if (year.toString().length === 4 && data.length > 0) colorPredictions(data);

    zoomToSelectedState(selectedState, map);
  }, [data, selectedState, map]);

  useEffect(() => {
    if (!initialFill && map && data.length > 0) {
      colorPredictions(data);
      setInitialFill(true);
    }

    if (map && data) {
      // remove current callback
      if (mapHoverCallback) map.off('mousemove', mapHoverCallback);

      // generate new callback
      const callback = createMapHoverCallback(data, allRangerDistricts, dataMode, selectedState, availableStates);
      setMapHoverCallback(() => callback);
      map.on('mousemove', callback);
    }
  }, [map, data, allRangerDistricts, dataMode, selectedState, availableStates]);

  // update the click callback handler when all RD or all states changes
  useEffect(() => {
    if (map && availableStates && availableSublocations) {
      // remove current callback
      if (mapClickCallback) map.off('click', VECTOR_LAYER, mapClickCallback);

      // generate new callback
      const callback = createMapClickCallback(
        availableStates,
        availableSublocations,
        selectedState,
        data,
        dataMode,
        props.county,
        setCounty,
        props.rangerDistrict,
        setRangerDistrict,
      );
      setMapClickCallback(() => callback);
      map.on('click', VECTOR_LAYER, callback);
    }
  }, [map, availableStates, availableSublocations, selectedState, data, dataMode]);

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
      const callback = () => setPredictionHover(null);

      setMapLayerMouseLeaveCallback(() => callback);
      map.on('mouseleave', VECTOR_LAYER, callback);
    }
  }, [map]);

  useEffect(() => {
    if (data.length === 0 && map && map.getLayer(VECTOR_LAYER)) {
      map.removeLayer(VECTOR_LAYER);
    }
  }, [data, map]);

  useEffect(() => {
    if (data.length === 1) {
      setPredictionModal(true);
    }
  }, [data]);

  // Helper function to get risk level label
  const getRiskLevel = (index) => {
    const riskLevels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High', 'Extreme'];
    return riskLevels[index] || 'Unknown';
  };

  // Prepare legend data for the overlay
  const legendItems = thresholds.map((threshold, index) => ({
    color: colors[index],
    label: `${threshold} (${getRiskLevel(index)})`,
  }));

  return (
    <>
      <TogglesOverlay />
      <div className="container flex-item-left" id="map-container">
        <Map
          hover={predictionHover}
          downloadCallback={() => downloadMap(
            map,
            year,
            isDownloadingMap,
            setIsDownloadingMap,
            selectedState,
            MAP_TITLES.PREDICTION,
            { titleDetails: { selectedState, period: year }, thresholds, colors },
          )}
          isDownloadingMap={isDownloadingMap}
        />
        <LegendOverlay
          legendItems={legendItems}
          title="Outbreak Probability (%)"
        />
      </div>
    </>
  );
};

export default PredictionMap;
