import mapboxgl from 'mapbox-gl';
import mapboxPrintPdf from 'mapbox-print-pdf';
import {
  DATA_MODES,
  MAP_SOURCE_NAME,
  MAP_SOURCES,
  MAP_TITLES,
  stateAbbrevToZoomLevel,
  VECTOR_LAYER,
} from '../constants';
import { getMapboxRDNameFormat } from './abbreviation-mappings';
import { logError, logWarning } from './logger';
import { isMapRemoved, markMapAsRemoved } from './map-instance-tracker';

// Map configuration constants
const MAP_CONTAINER_ID = 'map';
const MAP_STYLE_URL = 'mapbox://styles/pine-beetle-prediction/ckgrzijos0q5119paazko291z';
const DEFAULT_CENTER = [-84.3880, 33.7490];
const DEFAULT_ZOOM = 4.8;
const MAX_ZOOM = 6;

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text safe for HTML insertion
 */
const escapeHtml = (text) => {
  if (!text) return '';
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#x27;',
  };
  return String(text).replace(/[&<>"']/g, (char) => htmlEscapes[char]);
};

// Hover tooltip positioning constants
const HOVER_BOUNDARY_X = 300;
const HOVER_BOUNDARY_Y = 200;
const HOVER_TOOLTIP_OFFSET_X = 280;
const HOVER_TOOLTIP_OFFSET_Y = 125;

/**
 * Configuration options for map click callback
 * @typedef {Object} MapClickOptions
 * @property {Array<string>} states - Available states
 * @property {Array<string>} sublocations - Available sublocations (counties or ranger districts)
 * @property {string} currentState - Currently selected state
 * @property {Array<Object>} data - Prediction/trapping data
 * @property {string} dataMode - Current data mode (COUNTY or RANGER_DISTRICT)
 * @property {Array<string>} county - Currently selected county
 * @property {Function} setCounty - County setter function
 * @property {Array<string>} rangerDistrict - Currently selected ranger district
 * @property {Function} setRangerDistrict - Ranger district setter function
 * @property {Function} [setPredictionModal] - Optional modal setter function
 * @property {boolean} [isMobile=false] - Whether on mobile device
 */

/**
 * Creates a click callback for map interactions
 * @param {MapClickOptions} options - Configuration options
 * @returns {Function} Click event handler
 */
const createMapClickCallback = (options) => (e) => {
  const {
    states,
    sublocations,
    currentState,
    data,
    dataMode,
    county: propsCounty,
    setCounty,
    rangerDistrict: propsRangerDistrict,
    setRangerDistrict,
    setPredictionModal,
    isMobile = false,
  } = options;

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

  // On mobile, always open modal when clicking a county (don't toggle selection)
  if (isMobile && dataMode === DATA_MODES.COUNTY && sublocations.includes(county)) {
    // Find the prediction data for this county
    const countyData = data.find((p) => p.county === county && p.state === state);
    if (countyData) {
      setCounty([county]);
      if (setPredictionModal) setPredictionModal(true);
    }
    return;
  }

  // Desktop behavior: select county or RD depending on mode
  if (dataMode === DATA_MODES.COUNTY && sublocations.includes(county)) {
    if (propsCounty.length > 0) {
      setCounty([]);
      if (setPredictionModal) setPredictionModal(false);
    } else {
      setCounty([county]);
      if (setPredictionModal) setPredictionModal(true);
    }
  } else if (sublocations.includes(rangerDistrictToSet)) {
    if (propsRangerDistrict.length > 0) {
      setRangerDistrict([]);
      if (setPredictionModal) setPredictionModal(false);
    } else {
      setRangerDistrict([rangerDistrictToSet]);
      if (setPredictionModal) setPredictionModal(true);
    }
  }
};

const createHoverCallback = (map, rangerDistricts, mode, callback, isMobile = false) => (e) => {
  if (isMobile) return;

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

    const hoverRD = rawForest.replaceAll('  ', ' ');

    const location = mode === DATA_MODES.COUNTY
      ? hoverCounty
      : rangerDistricts.filter((rd) => !!rd)
        .find((rd) => getMapboxRDNameFormat(rd)?.includes(hoverRD));

    callback(hoverState, location, x, y, counties);
  } else {
    callback(null, null, null, null, []);
  }
};

// Track the current map instance to ensure proper cleanup
let currentMapInstance = null;

/**
 * @typedef {Object} GenerateMapOptions
 * @property {boolean} forceRegenerate - Whether to force map regeneration
 * @property {Object|null} map - Existing map instance
 * @property {string} dataMode - Current data mode (COUNTY or RANGER_DISTRICT)
 * @property {Function} setMap - Setter for map instance
 */

/**
 * Generates a new Mapbox map instance with proper cleanup of existing instances
 * Event callbacks (click, hover) should be registered via useMapCallbacks hook
 * @param {GenerateMapOptions} options - Map configuration options
 */
const generateMap = ({
  forceRegenerate,
  map,
  dataMode,
  setMap,
}) => {
  if (map && !forceRegenerate) return;

  // CRITICAL: Destroy existing map instance before creating a new one to prevent WebGL context leaks
  // Clean up any existing map instance (from parameter or tracked instance)
  const mapToCleanup = map || currentMapInstance;
  if (mapToCleanup) {
    try {
      // Check if map is in a valid state before cleanup
      // Verify the map has a container and hasn't been removed already
      if (!isMapRemoved(mapToCleanup)) {
        const hasGetContainer = mapToCleanup.getContainer && typeof mapToCleanup.getContainer === 'function';
        const hasRemove = typeof mapToCleanup.remove === 'function';

        if (hasGetContainer && hasRemove) {
          let container = null;
          try {
            container = mapToCleanup.getContainer();
          } catch (error) {
            // getContainer failed, mark as removed and skip cleanup
            markMapAsRemoved(mapToCleanup);
          }

          if (container && container.parentNode && !isMapRemoved(mapToCleanup)) {
            try {
              markMapAsRemoved(mapToCleanup);
              mapToCleanup.remove();
            } catch (error) {
              markMapAsRemoved(mapToCleanup);
              logWarning('Error removing map in generateMap', error, { function: 'generateMap' });
            }
          }
        }
      }
    } catch (error) {
      // Silently ignore errors - map may already be removed or in invalid state
      // This is expected when maps are being rapidly created/destroyed
    }
    // Clear the tracked instance
    if (mapToCleanup === currentMapInstance) {
      currentMapInstance = null;
    }
  }

  const existingMapContainer = document.getElementById(MAP_CONTAINER_ID);
  if (existingMapContainer) {
    const containerMap = existingMapContainer._mapboxgl_map
                         || (existingMapContainer.firstChild && existingMapContainer.firstChild._mapboxgl_map);
    if (containerMap && containerMap !== mapToCleanup && typeof containerMap.remove === 'function' && !isMapRemoved(containerMap)) {
      try {
        markMapAsRemoved(containerMap);
        containerMap.remove();
      } catch (error) {
        logWarning('Error cleaning up container map instance', error, { function: 'generateMap' });
      }
    }
  }

  const createdMap = new mapboxgl.Map({
    container: MAP_CONTAINER_ID,
    style: MAP_STYLE_URL,
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    maxZoom: MAX_ZOOM,
    bearing: 0,
    options: {
      trackResize: true,
    },
  });

  createdMap.addControl(new mapboxgl.NavigationControl({
    showCompass: true,
    showZoom: true,
  }));

  // add map source on load
  if (!createdMap._listeners.load) {
    createdMap.on('load', () => {
      if (!createdMap.getSource(MAP_SOURCE_NAME)) {
        createdMap.addSource(MAP_SOURCE_NAME, dataMode === DATA_MODES.COUNTY ? MAP_SOURCES.COUNTY : MAP_SOURCES.RANGER_DISTRICT);
      }
    });
  }

  // NOTE: Click and hover callbacks are NOT registered here.
  // They are managed by the useMapCallbacks hook in components,
  // which handles dynamic updates when filters/data change.

  // Track the new map instance
  currentMapInstance = createdMap;
  setMap(createdMap);
};

// adopted from old site
// Creates and returns HTML with the title for the header
// of the downloaded maps. This object is used by the mapbox-print-pdf library.
const buildHeader = (mapTitle) => {
  const safeTitle = escapeHtml(mapTitle);
  return (
    `<div id="map-header" style="text-align: center;">
          <h2 style="letter-spacing: 1px;margin-top: 200px;margin-bottom: 50px;">${safeTitle}</h2>
        </div>`
  );
};

// adopted from old site
// Creates and returns HTML with information for the footer
// of the downloaded maps. This includes a legend for the color scale,
// notes explaining the legend and sources, and information about the
// data collection process. This object is used by the mapbox-print-pdf library.
const buildFooter = (titleDetails, thresholds, colors, mapTitle) => {
  const isPredictionMap = mapTitle === MAP_TITLES.PREDICTION;
  const isHistoricalMap = mapTitle === MAP_TITLES.HISTORICAL;
  const isComparisonMap = mapTitle === MAP_TITLES.COMPARISON;

  const safeState = escapeHtml(titleDetails.selectedState);
  const safePeriod = escapeHtml(titleDetails.period);
  const title = `Southern Pine Beetle Outbreak ${isPredictionMap ? 'Prediction' : 'Spot'} Maps: ${safeState} ${safePeriod}`;

  // creates the color boxes and text fields for the legend in the footer
  const legendString = thresholds.reduce((acc, curr, index) => {
    const safeLayer = escapeHtml(curr);
    const color = colors[index];
    const safeColor = /^#[0-9A-Fa-f]{6}$|^[a-zA-Z]+$/.test(color) ? color : '#000000';
    const spanString = `
          <div class="footer-legend-key" style="font-family: 'Open Sans', arial, serif;background: ${safeColor};display:
          inline-block;border-radius: 20%;width: 20px;height: 20px;margin-right: 5px;margin-left: 5px;"></div><span>${safeLayer}</span>`;
    return acc.concat(spanString);
  }, '');

  return (
    `
          <div id="map-footer" style="text-align: center;letter-spacing: 1px;margin-top: 20px;margin-bottom: 0;">
              ${isHistoricalMap ? `<p class="footnote" style="font-family: 'Open Sans', arial, serif;color: #898989;line-height:
                14px;width: 53%;margin: auto;margin-bottom: 16px;font-size: 14px;">Total spots per year:</p>` : ''}
              ${isComparisonMap ? `<p class="footnote" style="font-family: 'Open Sans', arial, serif;color: #898989;line-height:
                14px;width: 53%;margin: auto;margin-bottom: 16px;font-size: 14px;">Predicted vs observed outcomes:</p>` : ''}
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
              <p style="font-family: 'Open Sans', arial, serif;font-size: 14px;margin-bottom: 16px;">Contact: Matthew P. Ayres - matthew.p.ayres@dartmouth.edu; Carissa F. Aoki - caoki@mica.edu
              </p>
              <p class="footnote" style="font-family: 'Open Sans', arial, serif;color: #898989;line-height: 14px;width: 53%;
              margin: auto;margin-bottom: 16px;font-size: 14px;">Sources: Esri, HERE, Garmin, Intermap, increment P Corp., GEBCO, USGS,FAO, NPS, NRCAN,
              GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), swisstopo, © OpenStreetMap
              contributors, and the GIS User Community</p>
          </div>
          `
  );
};

const downloadMap = (map, year, isDownloadingMap, setIsDownloadingMap, selectedState, mapTitle, footerContent) => {
  if (!map || !year || isDownloadingMap) return;

  setIsDownloadingMap(true);

  const mapName = `${selectedState || 'All States'}-${year}.pdf`;
  const { titleDetails, thresholds, colors } = footerContent;

  mapboxPrintPdf.build()
    .header({
      html: buildHeader(mapTitle),
      baseline: { format: 'a3', orientation: 'p' },
    })
    .footer({
      html: buildFooter(titleDetails, thresholds, colors, mapTitle),
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
      logError('Error downloading map', error, { function: 'downloadMap' });
      setIsDownloadingMap(false);
    });
};

const zoomToSelectedState = (selectedState, map) => {
  if (!map) return;

  const zoomConfig = selectedState && stateAbbrevToZoomLevel[selectedState]
    ? stateAbbrevToZoomLevel[selectedState]
    : [DEFAULT_CENTER, DEFAULT_ZOOM];

  map.flyTo({
    center: zoomConfig[0],
    zoom: zoomConfig[1],
  });
};

const mapboxHoverStyle = (x, y) => {
  const left = x < HOVER_BOUNDARY_X ? x : x - HOVER_TOOLTIP_OFFSET_X;
  const top = y < HOVER_BOUNDARY_Y ? y : y - HOVER_TOOLTIP_OFFSET_Y;
  return { left: `${left}px`, top: `${top}px` };
};

const isInvalidNumber = (num) => Number.isNaN(num) || num === null || num === undefined;

export {
  createHoverCallback,
  createMapClickCallback,
  downloadMap,
  generateMap,
  isInvalidNumber,
  mapboxHoverStyle,
  zoomToSelectedState
};
