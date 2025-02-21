import React from 'react';
import mapboxPrintPdf from 'mapbox-print-pdf';
import mapboxgl from 'mapbox-gl';
import {
  DATA_MODES,
  MAP_SOURCE_NAME,
  MAP_SOURCES,
  MAP_TYPES,
  stateAbbrevToZoomLevel,
  VECTOR_LAYER,
} from '../constants';
import { getMapboxRDNameFormat } from './abbreviation-mappings';

// twice-curried function for generating click callback
const createMapClickCallback = (states, sublocations, currentState, data, dataMode, propsCounty, setCounty, propsRangerDistrict, setRangerDistrict) => (e) => {
  if (!e?.features[0]?.properties) return;

  const {
    COUNTYNAME: county,
    forest: clickRD,
    STATE: mapboxState,
  } = e.features[0].properties;

  const rangerDistrictToSet = sublocations.filter((rd) => !!rd)
    .find((district) => district.includes(clickRD));

  const state = !mapboxState && dataMode === DATA_MODES.RANGER_DISTRICT
    ? data.find((p) => p.rangerDistrict === rangerDistrictToSet)?.state
    : mapboxState;

  // ensure clicked on valid state
  if (!states.includes(state) || !currentState) return;

  // select county or RD depending on mode
  if (dataMode === DATA_MODES.COUNTY && sublocations.includes(county)) {
    if (propsCounty.length > 0) { // remove selection if user clicks selected county
      setCounty([]);
    } else {
      setCounty([county]);
    }
  } else if (sublocations.includes(rangerDistrictToSet)) {
    if (propsRangerDistrict.length > 0) { // remove selection if user clicks selected ranger district
      setRangerDistrict([]);
    } else {
      setRangerDistrict([rangerDistrictToSet]);
    }
  }
};

// twice-curried function for generating hover callback
const createHoverCallback = (map, rangerDistricts, mode, callback) => (e) => {
  if (!map || !e || !map.isStyleLoaded()) return;

  const counties = map.getLayer(VECTOR_LAYER)
    ? map.queryRenderedFeatures(e.point, { layers: [VECTOR_LAYER] })
    : [];

  if (counties.length > 0 && counties[0]?.properties?.forest) {
    const { x, y } = e.point || {};

    const {
      STATE: hoverState,
      COUNTYNAME: hoverCounty,
      forest: rawForest,
    } = counties[0].properties;

    // handles case where tileset has two spaces instead of one (this is a one-off), or is missing the word RD altogether (also one-off)
    const hoverRD = rawForest.replaceAll('  ', ' ');

    const location = mode === DATA_MODES.COUNTY
      ? hoverCounty
      : rangerDistricts.filter((rd) => !!rd)
        .find((rd) => getMapboxRDNameFormat(rd)?.includes(hoverRD));

    callback(hoverState, location, x, y, counties);
  }
};

const generateMap = (forceRegenerate, map, thresholds, colors, setLegendTags, dataMode, mapClickCallback, setMapClickCallback, mapHoverCallback, setMapHoverCallback, setMap) => {
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

  const legendTagsToSet = thresholds.map((threshold, index) => {
    const color = colors[index];

    return (
      <div key={color}>
        <span className="legend-key" style={{ backgroundColor: color }} />
        <span className="legend-tag">{threshold}</span>
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
    setMapClickCallback(() => mapClickCallback);
    createdMap.on('click', VECTOR_LAYER, mapClickCallback);
  }

  if (createdMap._listeners.mousemove === undefined) {
    setMapHoverCallback(() => mapHoverCallback);
    createdMap.on('mousemove', mapHoverCallback);
  }

  setMap(createdMap);
};

// adopted from old site
// Creates and returns HTML with the title for the header
// of the downloaded maps. This object is used by the mapbox-print-pdf library.
const buildHeader = (mapType) => {
  return (
    `<div id="map-header" style="text-align: center;">
          <h2 style="letter-spacing: 1px;margin-top: 200px;margin-bottom: 50px;">${MAP_TYPES[mapType]}</h2>
        </div>`
  );
};

// adopted from old site
// Creates and returns HTML with information for the footer
// of the downloaded maps. This includes a legend for the color scale,
// notes explaining the legend and sources, and information about the
// data collection process. This object is used by the mapbox-print-pdf library.
const buildFooter = (titleDetails, thresholds, colors, mapType) => {
  const isPredictionMap = mapType === MAP_TYPES.PREDICTION;
  const isHistoricalMap = mapType === MAP_TYPES.HISTORICAL;

  const title = `Southern Pine Beetle Outbreak ${isPredictionMap ? 'Prediction' : 'Spot'} Maps: ${titleDetails.selectedState} ${titleDetails.period}`;

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
              ${isHistoricalMap ? `<p class="footnote" style="font-family: 'Open Sans', arial, serif;color: #898989;line-height:
                14px;width: 53%;margin: auto;margin-bottom: 16px;font-size: 14px;">Total spots per year:</p>` : ''}
              <div id="footer-legend" style="font-family: 'Open Sans', arial, serif;width: 90%;margin: auto;margin-bottom: 10px;">
                  ${legendString}
              </div>
              ${isPredictionMap ? `<p class="footnote" style="font-family: 'Open Sans', arial, serif;color: #898989;line-height:
              14px;width: 53%;margin: auto;margin-bottom: 16px;font-size: 14px;">Note: Color ramp ascends with a constant factor of
              increase in the probability of outcome.</p>` : ''}
              <div id="spacer" style="height: 50px;"></div>
              <h2 style="font-family: 'Open Sans', arial, serif;margin-bottom: 16px;margin-top: 16px;">${title}</h2>
              ${isPredictionMap ? `<p style="font-family: 'Open Sans', arial, serif;font-size: 14px;margin-bottom: 16px;">Predictions are based on a zero-inflated Poisson model fit to historical data
              from 1988 – 2009 (Aoki 2017). The most important drivers of model predictions are
               SPB trap captures in the current spring and SPB spots the previous year.
              </p>` : ''}
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

const downloadMap = (map, year, isDownloadingMap, setIsDownloadingMap, selectedState, mapType, footerContent) => {
  if (!map || !year || isDownloadingMap) return;

  setIsDownloadingMap(true);

  const mapName = `${selectedState || 'All States'}-${year}.pdf`;
  const { titleDetails, thresholds, colors } = footerContent;

  mapboxPrintPdf.build()
    .header({
      html: buildHeader(mapType),
      baseline: { format: 'a3', orientation: 'p' },
    })
    .footer({
      html: buildFooter(titleDetails, thresholds, colors, mapType),
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
      console.error(error);
    });
};

const zoomToSelectedState = (selectedState, map) => {
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
};

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

export {
  createMapClickCallback,
  createHoverCallback,
  downloadMap,
  generateMap,
  mapboxHoverStyle,
  zoomToSelectedState,
};
