// map of state abbreviations to their names
import MAP_INIT_CONSTANTS from './map-constants';
import stateAbbrevToStateName from './state-abbreviations.json';
import stateAbbrevToStateId from './state-ids.json';
import stateAbbrevToZoomLevel from './state-zoom-levels.json';

const MIN_WIDTH_THRESHOLD = 725;

const stateNameToAbbrev = Object.fromEntries(Object.entries(stateAbbrevToStateName).map(([k, v]) => [v, k]));

const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'DALI_PB_AUTH_TOKEN',
  CHART_MODE: 'DALI_PB_CHART_MODE',
  DATA_MODE: 'DALI_PB_DATA_MODE',
  USER_ID: 'DALI_PB_AUTH_USER_ID',
};

const DATA_MODES = {
  COUNTY: 'COUNTY',
  RANGER_DISTRICT: 'RANGER_DISTRICT',
};

const CHART_MODES = {
  MAP: 'MAP',
  GRAPH: 'GRAPH',
};

const ROUTES = {
  ABOUT: '/about',
  ADMIN: '/admin',
  BLOG: '/blog',
  CONTACT: '/contact',
  DATA: '/data',
  DATA_TABLE: '/data-table',
  DOWNLOAD_DATA: '/download-data',
  EXPLAINERS: '/explainers',
  HOME: '/',
  TIME_SERIES: '/time-series',
  METHODOLOGY: '/methodology',
  RESOURCES: '/resources',
  PLAY_WITH_MODEL: '/play-with-model',
  OBSERVED_OUTCOMES: '/observed-outcomes',
};

const RESOURCE_ROUTES = {
  CODE: '/SPB.PredictionModel.2022.zip',
  DISSERTATION: '/Aoki-Dissertation.pdf',
  ANNUAL: '/SPB.southwide.Annual.1988-2021.zip',
  UTILITY_RELIABILITY: '/2023_SPB-predictions.Utility-Reliabililty.v07.pdf',
  WEEKLY_OLD: '/SPB.southwide.Weekly.1987-2011.zip',
  WEEKLY: '/SPB.southwide.Weekly.2011-2017.zip',
};

const RESOURCE_LOCAL_ROOT = process.env.RESOURCE_LOCAL_URL;

const RESOURCE_LOCAL_URLS = {
  CODE: RESOURCE_LOCAL_ROOT + RESOURCE_ROUTES.CODE,
  DISSERTATION: RESOURCE_LOCAL_ROOT + RESOURCE_ROUTES.DISSERTATION,
  ANNUAL: RESOURCE_LOCAL_ROOT + RESOURCE_ROUTES.ANNUAL,
  UTILITY_RELIABILITY: RESOURCE_LOCAL_ROOT + RESOURCE_ROUTES.UTILITY_RELIABILITY,
  WEEKLY_OLD: RESOURCE_LOCAL_ROOT + RESOURCE_ROUTES.WEEKLY_OLD,
  WEEKLY: RESOURCE_LOCAL_ROOT + RESOURCE_ROUTES.WEEKLY,
};

const RESOURCE_REMOTE_ROOT = process.env.RESOURCE_REMOTE_URL;

const RESOURCE_REMOTE_URLS = {
  CODE: RESOURCE_REMOTE_ROOT + RESOURCE_ROUTES.CODE,
  DISSERTATION: RESOURCE_REMOTE_ROOT + RESOURCE_ROUTES.DISSERTATION,
  ANNUAL: RESOURCE_REMOTE_ROOT + RESOURCE_ROUTES.ANNUAL,
  UTILITY_RELIABILITY: RESOURCE_REMOTE_ROOT + RESOURCE_ROUTES.UTILITY_RELIABILITY,
  WEEKLY_OLD: RESOURCE_REMOTE_ROOT + RESOURCE_ROUTES.WEEKLY_OLD,
  WEEKLY: RESOURCE_REMOTE_ROOT + RESOURCE_ROUTES.WEEKLY,
};

const DOWNLOAD_DATA_ROUTES = {
  SUMMARIZED_COUNTY: '/summarized-county/download',
  SUMMARIZED_RD: '/summarized-rangerdistrict/download',
  UNSUMMARIZED: '/unsummarized-trapping/download',
  PREDICTED_COUNTY: '/summarized-county/download-predict',
  PREDICTED_RD: '/summarized-rangerdistrict/download-predict',
};

const DATA_TYPE_EXTENSIONS = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/zip': 'zip',
  'text/csv': 'csv',
};

const VIDEO_URL = 'https://drive.google.com/file/d/1lp0-8pCiAkaXqVclcxjjSx4RcBKGeH3M/preview';

const getYearRange = (start, end) => {
  // Handle edge cases where start or end might be undefined, null, or invalid
  if (typeof start !== 'number' || typeof end !== 'number' || Number.isNaN(start) || Number.isNaN(end)) {
    return [];
  }

  // Ensure start is not greater than end
  if (start > end) {
    return [];
  }

  const length = end - start + 1;
  if (length <= 0) {
    return [];
  }

  return Array(length).fill().map((_, idx) => start + idx);
};

const MAP_SOURCES = {
  COUNTY: {
    type: 'vector',
    url: 'mapbox://pine-beetle-prediction.1be58pyi',
  },
  RANGER_DISTRICT: {
    type: 'vector',
    url: 'mapbox://pine-beetle-prediction.b6vi50h0',
  },
};

const SOURCE_LAYERS = {
  COUNTY: 'US_Counties_updated',
  RANGER_DISTRICT: '08_09_RDmap',
};

const STATE_VECTOR_LAYER = 'states';

// these are completely arbitrary
const MAP_SOURCE_NAME = 'sublocations';
const VECTOR_LAYER = 'map-choropleth-layer';

const MAP_TITLES = {
  PREDICTION: 'Probability of (Any) SPB Spots',
  HISTORICAL: 'Observed Outcomes',
  TIME_SERIES: 'Average Number of Spots',
  COMPARISON: 'Observed vs Predicted',
};

export {
  CHART_MODES,
  DATA_MODES,
  DATA_TYPE_EXTENSIONS,
  DOWNLOAD_DATA_ROUTES,
  getYearRange,
  LOCAL_STORAGE_KEYS,
  MAP_INIT_CONSTANTS,
  MAP_SOURCE_NAME,
  MAP_SOURCES,
  MAP_TITLES,
  MIN_WIDTH_THRESHOLD,
  RESOURCE_LOCAL_URLS,
  RESOURCE_REMOTE_URLS,
  RESOURCE_ROUTES,
  ROUTES,
  SOURCE_LAYERS,
  STATE_VECTOR_LAYER,
  stateAbbrevToStateId,
  stateAbbrevToStateName,
  stateAbbrevToZoomLevel,
  stateNameToAbbrev,
  VECTOR_LAYER,
  VIDEO_URL,
};
