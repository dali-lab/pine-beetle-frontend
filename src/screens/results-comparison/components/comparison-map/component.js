import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Map from '../../../../components/map';
import {
  DATA_MODES, MAP_SOURCE_NAME, MAP_TITLES, SOURCE_LAYERS, STATE_VECTOR_LAYER, VECTOR_LAYER,
} from '../../../../constants';
import {
  createHoverCallback,
  createMapClickCallback,
  downloadMap,
  generateMap,
  getMapboxRDNameFormat,
  mapboxHoverStyle,
  zoomToSelectedState,
} from '../../../../utils';
import { api } from '../../../../services';
import TogglesOverlay from '../../../../components/map/components';
import { colors, thresholds } from './constants';

import './style.scss';
import { isInvalidNumber } from '../../../../utils/map';

const getFillColor = (fillProb, sumSpots) => {
  if (fillProb >= 0.25 && sumSpots > 50) {
    return colors[0];
  } else if (fillProb < 0.25 && sumSpots < 50) {
    return colors[1];
  } else if (fillProb < 0.25 && sumSpots > 50) {
    return colors[2];
  } else if (fillProb >= 0.25 && sumSpots <= 50) {
    return colors[3];
  } else {
    return colors[4];
  }
};

const ComparisonMap = (props) => {
  const {
    availableStates,
    availableSublocations,
    data,
    dataMode,
    selectedState,
    setCounty,
    setRangerDistrict,
    setState,
    year,
    isLoading,
  } = props;
  const [map, setMap] = useState();
  const [initialFill, setInitialFill] = useState(false);
  const [legendTags, setLegendTags] = useState([]);
  const [resultsHover, setResultsHover] = useState(null);
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

  const createMapHoverCallback = (resultsData, rangerDistricts, mode, state, availStates) => {
    const callback = (hoverState, location, x, y) => {
      const pred = resultsData.find((p) => {
      // either ranger district mode or have a matching state
        return (mode === DATA_MODES.RANGER_DISTRICT || (p.state === hoverState && p.state === state) || (!state && availStates.includes(hoverState)))
              // and sublocation matches
              && ((p.county === location && mode === DATA_MODES.COUNTY && p.state === hoverState) || (p.rangerDistrict === location && mode === DATA_MODES.RANGER_DISTRICT));
      });

      if (pred && x && y) {
        const {
          county: countyName,
          probSpotsGT50: probOutbreak,
          sumSpots: spotsCount,
        } = pred;

        setResultsHover((
          <div id="prediction-hover" style={mapboxHoverStyle(x, y)}>
            <h3>{dataMode === DATA_MODES.COUNTY ? `${countyName} County` : `${getMapboxRDNameFormat(location).slice(0, -3)} Ranger District`}</h3>
            <p>Predicted probability of an outbreak: {isInvalidNumber(probOutbreak) ? 'null' : (probOutbreak * 100).toFixed(1)}%</p>
            <p>Number of spots: {isInvalidNumber(spotsCount) ? 'null' : spotsCount}</p>
          </div>
        ));
      } else {
        setResultsHover(null);
      }
    };

    return createHoverCallback(map, rangerDistricts, dataMode, callback);
  };

  const colorResults = (comparisonData) => {
    // keep trying until map styles are loaded
    if (!map.isStyleLoaded()) {
      setTimeout(() => {
        colorResults(comparisonData);
      }, 1000);

      return;
    }

    // remove county layer if already constructed
    if (map.getLayer(VECTOR_LAYER)) {
      map.removeLayer(VECTOR_LAYER);
    }

    const fillExpression = ['match', ['upcase', ['get', 'forest']]];
    const strokeExpression = ['match', ['upcase', ['get', 'forest']]];

    comparisonData.forEach(({
      county,
      probSpotsGT50: fillProb,
      sumSpots,
      rangerDistrict,
      state,
    }) => {
      const color = getFillColor(fillProb, sumSpots);

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
        setLegendTags,
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
    if (year.toString().length === 4 && data.length > 0) colorResults(data);

    zoomToSelectedState(selectedState, map);
  }, [data, selectedState, map, dataMode]);

  useEffect(() => {
    if (!initialFill && map && data.length > 0) {
      colorResults(data);
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
      const callback = () => setResultsHover(null);

      setMapLayerMouseLeaveCallback(() => callback);
      map.on('mouseleave', VECTOR_LAYER, callback);
    }
  }, [map]);

  useEffect(() => {
    if (data.length === 0 && map && map.getLayer(VECTOR_LAYER)) {
      map.removeLayer(VECTOR_LAYER);
    }
  }, [data, map]);

  return (
    <>
      <TogglesOverlay />
      <div className="container results-comparison-map" id="map-container">
        <Map
          legend={(
            <>
              <div className="legend-key-title">Results comparison</div>
              {legendTags}
            </>
            )}
          hover={resultsHover}
          isDownloadingMap={isDownloadingMap}
          downloadCallback={() => downloadMap(
            map,
            year,
            isDownloadingMap,
            setIsDownloadingMap,
            selectedState,
            MAP_TITLES.PREDICTION,
            { titleDetails: { selectedState, period: year }, thresholds, colors },
          )}
        />
        {!isLoading && !data.length && (
        <div className="results-comparison-message">
          <p>
            {`Map for ${year} not yet available. Spot data for the previous year usually come online sometime in January or February of the following year.`}
          </p>
        </div>
        )}
      </div>
    </>
  );
};

export default ComparisonMap;
