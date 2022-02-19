/* eslint-disable prefer-destructuring */
import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import printPdf from 'mapbox-print-pdf';

import { DATA_MODES, stateAbbrevToZoomLevel } from '../../../../constants';
import { getMapboxRDNameFormat } from '../../../../utils';
import { api } from '../../../../services';

import {
  thresholds,
  colors,
  MAP_SOURCES,
  SOURCE_LAYERS,
  MAP_SOURCE_NAME,
  VECTOR_LAYER,
  STATE_VECTOR_LAYER,
} from './utils';

import './style.scss';

const questionIcon = require('../../../../assets/icons/help-circle.png');

const helpText = 'Please use Chrome, Firefox,<br />\nor Edge to download map.';

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
    year,
  } = props;

  const [map, setMap] = useState();
  const [initialFill, setInitialFill] = useState(false);
  const [legendTags, setLegendTags] = useState([]);
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
        .catch(console.log);
    }
  }, [dataMode]);

  const mapboxHoverStyle = (x, y) => {
    if (x < 300 && y < 200) {
      return ({ left: `${x}px`, top: `${y}px` });
    } else if (y < 200) {
      return ({ left: `${x - 280}px`, top: `${y}px` });
    } else if (x < 300) {
      return ({ left: `${x}px`, top: `${y - 125}px` });
    } else {
      return ({ left: `${x - 280}px`, top: `${y - 125}px` });
    }
  };

  // twice-curried function for generating hover callback
  const createMapHoverCallback = (predictions, rangerDistricts, mode, state, availStates) => (e) => {
    if (!map || !e || !map.isStyleLoaded()) return;

    const counties = map.queryRenderedFeatures(e.point, {
      layers: [VECTOR_LAYER],
    });

    if (counties.length > 0 && counties[0]?.properties?.forest) {
      const { x, y } = e.point || {};

      const {
        STATE: hoverState,
        COUNTYNAME: hoverCounty,
        forest: rawForest,
      } = counties[0].properties;

      const hoverRD = rawForest.replaceAll('  ', ' ');

      const location = mode === DATA_MODES.COUNTY
        ? hoverCounty
        : rangerDistricts.filter(rd => !!rd)
          .find(rd => rd.includes(hoverRD));

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

        const isInvalidNumber = num => Number.isNaN(num) || num === null || num === undefined;

        setPredictionHover((
          <div id="prediction-hover" style={mapboxHoverStyle(x, y)}>
            <h3>{dataMode === DATA_MODES.COUNTY ? `${countyName} County` : `${counties[0].properties.forest.slice(0, -3)} Ranger District`}</h3>
            <p>Probability of any spots: {isInvalidNumber(probAny) ? 'null' : (probAny * 100).toFixed(1)}%</p>
            <p>Probability of an outbreak: {isInvalidNumber(probOutbreak) ? 'null' : (probOutbreak * 100).toFixed(1)}%</p>
          </div>
        ));
      } else {
        setPredictionHover(null);
      }
    }
  };

  // twice-curried function for generating click callback
  const createMapClickCallback = (states, sublocations, currentState, predictions, mode) => (e) => {
    if (!e?.features[0]?.properties) return;

    const {
      COUNTYNAME: county,
      forest: clickRD,
      STATE: _state,
    } = e.features[0].properties;

    const rangerDistrictToSet = sublocations.filter(rd => !!rd)
      .find(district => district.includes(clickRD));

    const state = !_state && mode === DATA_MODES.RANGER_DISTRICT
      ? predictions.find(p => p.rangerDistrict === rangerDistrictToSet)?.state
      : _state;

    // ensure clicked on valid state
    if (!states.includes(state) || !currentState) return;

    // select county or RD depending on mode
    if (dataMode === DATA_MODES.COUNTY && sublocations.includes(county)) {
      if (props.county) { // remove selection if user clicks selected county
        setCounty('');
      } else {
        setCounty(county);
      }
    } else if (sublocations.includes(rangerDistrictToSet)) {
      if (props.rangerDistrict) { // remove selection if user clicks selected ranger district
        setRangerDistrict('');
      } else {
        setRangerDistrict(rangerDistrictToSet);
      }
    }
  };

  const generateMap = (forceRegenerate) => {
    if (map && !forceRegenerate) return;

    const createdMap = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/pine-beetle-prediction/ckgrzijos0q5119paazko291z',
      center: [-84.3880, 33.7490], // starting position
      zoom: 4.8, // starting zoom
      options: {
        trackResize: true,
      },
    });

    createdMap.addControl(new mapboxgl.NavigationControl());

    // disable map zoom when using scroll
    createdMap.scrollZoom.disable();

    const legendTagsToSet = thresholds.map((threshold, index) => {
      const color = colors[index];

      return (
        <div key={color}>
          <span className="legend-key" style={{ backgroundColor: color }} />
          <span>{threshold}</span>
        </div>
      );
    });

    // add legend tags
    setLegendTags(legendTagsToSet);

    // add map source on load
    if (!createdMap._listeners.load) {
      createdMap.on('load', () => {
        if (!createdMap.getSource(MAP_SOURCE_NAME)) {
          createdMap.addSource(MAP_SOURCE_NAME, dataMode === DATA_MODES.COUNTY ? MAP_SOURCES.COUNTY : MAP_SOURCES.RANGER_DISTRICT);
        }
      });
    }

    // select county/RD when user clicks on it
    if (!createdMap._listeners.click) {
      const callback = createMapClickCallback(availableStates, availableSublocations, selectedState, data, dataMode);
      setMapClickCallback(() => callback);
      createdMap.on('click', VECTOR_LAYER, callback);
    }

    if (createdMap._listeners.mousemove === undefined) {
      const callback = createMapHoverCallback(data, allRangerDistricts, dataMode, selectedState, availableStates);
      setMapHoverCallback(() => callback);
      createdMap.on('mousemove', callback);
    }

    setMap(createdMap);
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
      let color;

      if (fillProb <= 0.025) {
        color = colors[0];
      } else if (fillProb > 0.025 && fillProb <= 0.05) {
        color = colors[1];
      } else if (fillProb > 0.05 && fillProb <= 0.15) {
        color = colors[2];
      } else if (fillProb > 0.15 && fillProb <= 0.25) {
        color = colors[3];
      } else if (fillProb > 0.25 && fillProb <= 0.4) {
        color = colors[4];
      } else {
        color = colors[5];
      }

      const countyFormatName = county && state ? `${county.toUpperCase()} ${state}` : '';
      const rangerDistrictFormatName = rangerDistrict ? getMapboxRDNameFormat(rangerDistrict).toUpperCase() : '';

      const locationName = dataMode === DATA_MODES.COUNTY
        ? countyFormatName
        // handles case where tileset has two spaces instead of one (this is a one-off)
        : [rangerDistrictFormatName, rangerDistrictFormatName.replace(' RD', '  RD')];

      fillExpression.push(locationName, color);
      strokeExpression.push(locationName, '#000000');
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

  // adopted from old site
  // Creates and returns HTML with the title for the header
  // of the downloaded maps. This object is used by the mapbox-print-pdf library.
  const buildHeader = () => {
    return (
      `<div id="map-header" style="text-align: center;">
          <h2 style="letter-spacing: 1px;margin-top: 200px;margin-bottom: 50px;">Probability of (Any) SPB Spots</h2>
        </div>`
    );
  };

  // adopted from old site
  // Creates and returns HTML with information for the footer
  // of the downloaded maps. This includes a legend for the color scale,
  // notes explaining the legend and sources, and information about the
  // data collection process. This object is used by the mapbox-print-pdf library.
  const buildFooter = () => {
    const title = `Southern Pine Beetle Outbreak Prediction Maps: ${selectedState} ${year}`;

    // creates the color boxes and text fields for the legend in the footer
    const legendString = thresholds.reduce((acc, curr, index) => {
      const layer = curr;
      const color = colors[index];
      const spanString = `
          <div class="footer-legend-key" style="font-family: 'Open Sans', arial, serif;background: ${color};display:
          inline-block;border-radius: 20%;width: 20px;height: 20px;margin-right: 5px;margin-left: 5px;"></div><span>${layer}</span>`;
      return acc.concat(spanString);
    }, '');

    return (
      `
          <div id="map-footer" style="text-align: center;letter-spacing: 1px;margin-top: 20px;margin-bottom: 0;">
              <div id="footer-legend" style="font-family: 'Open Sans', arial, serif;width: 90%;margin: auto;margin-bottom: 10px;">
                  ${legendString}
              </div>
              <p class="footnote" style="font-family: 'Open Sans', arial, serif;color: #898989;line-height:
              14px;width: 53%;margin: auto;margin-bottom: 16px;font-size: 14px;">Note: Color ramp ascends with a constant factor of
              increase in the probability of outcome.</p>
              <div id="spacer" style="height: 50px;"></div>
              <h2 style="font-family: 'Open Sans', arial, serif;margin-bottom: 16px;margin-top: 16px;">${title}</h2>
              <p style="font-family: 'Open Sans', arial, serif;font-size: 14px;margin-bottom: 16px;">Predictions are based on a zero-inflated Poisson model fit to historical data
              from 1988 – 2009 (Aoki 2017). The most important drivers of model predictions are
               SPB trap captures in the current spring and SPB spots the previous year.
              </p>
              <p style="font-family: 'Open Sans', arial, serif;font-size: 14px;margin-bottom: 16px;">
              The SPB prediction project is supported by USDA Forest Service: Science and Technology
              Development Program (STDP)
              </p>
              <p style="font-family: 'Open Sans', arial, serif;font-size: 14px;margin-bottom: 16px;">Contact: Matthew P. Ayres - matthew.p.ayres@dartmouth.edu; Carissa F. Aoki - caoki@bates.edu
              </p>
              <p class="footnote" style="font-family: 'Open Sans', arial, serif;color: #898989;line-height: 14px;width: 53%;
              margin: auto;margin-bottom: 16px;font-size: 14px;">Sources: Esri, HERE, Garmin, Intermap, increment P Corp., GEBCO, USGS,FAO, NPS, NRCAN,
              GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), swisstopo, © OpenStreetMap
              contributors, and the GIS User Community</p>
          </div>
          `
    );
  };

  const downloadMap = () => {
    if (!map || !year || isDownloadingMap) return;

    setIsDownloadingMap(true);

    const mapName = `${selectedState || 'All States'}-${year}.pdf`;

    printPdf.build()
      .header({
        html: buildHeader(),
        baseline: { format: 'a3', orientation: 'p' },
      })
      .footer({
        html: buildFooter(),
        baseline: { format: 'a3', orientation: 'p' },
      })
      .margins({
        top: 8,
        right: 8,
        left: 8,
        bottom: 8,
      }, 'pt')
      .format('a3')
      .portrait()
      .print(map, mapboxgl)
      .then((pdf) => {
        pdf.save(mapName);
        setIsDownloadingMap(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

    setTimeout(() => {
      setMap(undefined);
      generateMap(true);
    }, 100);
  }, [dataMode]);

  useEffect(() => {
    if (!map) return;

    if (year.toString().length === 4 && data.length > 0) colorPredictions(data);

    if (selectedState) {
      const zoom = stateAbbrevToZoomLevel[selectedState] || [[-84.3880, 33.7490], 4.8];

      map.flyTo({
        center: zoom[0],
        zoom: zoom[1],
      });
    } else {
      map.flyTo({
        center: [-84.3880, 33.7490],
        zoom: 4.8,
      });
    }
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
      const callback = createMapClickCallback(availableStates, availableSublocations, selectedState, data, dataMode);
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
  }, [data]);

  return (
    <div className="container flex-item-left" id="map-container">
      <div id="map" />
      <div className="map-overlay-data" id="data">
        <h3 className="data-title">Select county or federal land on the map to view prediction data</h3>
        <div className="data-info">
          <div className="data-info-section">
            <div className="circle" id="any-spots">
              {data[0] ? <div id="percent">{((data[0].probSpotsGT0) * 100).toFixed(1)}%</div> : <div id="percent" />}
            </div>
            <p>Predicted % Chance of Any Spots ({'>'}0 spots)</p>
          </div>
          <div className="data-info-section">
            <div className="circle" id="outbreak">
              {data[0] ? <div id="percent">{((data[0].probSpotsGT50) * 100).toFixed(1)}%</div> : <div id="percent" />}
            </div>
            <p>Predicted % Chance of Outbreak ({'>'}50 spots)</p>
          </div>
        </div>
      </div>
      <div id="map-overlay-download" onClick={downloadMap}>
        <h4>{isDownloadingMap ? 'Downloading...' : 'Download Map'}</h4>
        <div>
          <img id="icon-small"
            data-tip={helpText}
            src={questionIcon}
            alt="Help"
          />
          <ReactTooltip multiline place="right" />
        </div>
      </div>
      <div className="map-overlay-legend" id="legend">
        <div className="legend-key-title">Probability of &gt;50 spots</div>
        {legendTags}
      </div>
      {predictionHover}
    </div>
  );
};

export default PredictionMap;
