// map of state abbreviations to their names
import stateAbbrevToStateName from './state-abbreviations.json';
import stateAbbrevToStateId from './state-ids.json';
import stateAbbrevToZoomLevel from './state-zoom-levels.json';

const MIN_WIDTH_THRESHOLD = 725;

const SERVER_ENDPOINTS = {
  LOCAL: 'http://localhost:9090/v3',
  DEV: 'https://pine-beetle-prediction-dev.herokuapp.com/v3',
  PROD: 'https://pine-beetle-prediction.herokuapp.com/v3',
};

const AUTOMATION_SERVER_ENDPOINTS = {
  LOCAL: 'http://localhost:9091/v3',
  DEV: 'https://pine-beetle-automation-dev.herokuapp.com/v3',
  PROD: 'https://pine-beetle-automation.herokuapp.com/v3',
};

const stateNameToAbbrev = Object.fromEntries(Object.entries(stateAbbrevToStateName).map(([k, v]) => [v, k]));

const getServerUrl = () => {
  switch (process.env.MAIN_BACKEND_ENV) {
    case 'LOCAL':
      return SERVER_ENDPOINTS.LOCAL;

    case 'DEV':
      return SERVER_ENDPOINTS.DEV;

    case 'PROD':
      return SERVER_ENDPOINTS.PROD;

    default:
      return SERVER_ENDPOINTS.DEV;
  }
};

const getAutomationServerUrl = () => {
  switch (process.env.AUTOMATION_ENV) {
    case 'LOCAL':
      return AUTOMATION_SERVER_ENDPOINTS.LOCAL;

    case 'DEV':
      return AUTOMATION_SERVER_ENDPOINTS.DEV;

    case 'PROD':
      return AUTOMATION_SERVER_ENDPOINTS.PROD;

    default:
      return AUTOMATION_SERVER_ENDPOINTS.DEV;
  }
};

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
  HOME: '/',
  RESOURCES: '/resources',
  PLAY_WITH_MODEL: '/play-with-model',
  PREDICTIONS: '/predict-outbreak',
  TRAPPING_DATA: '/historical-data',
};

const RESOURCE_ROUTES = {
  CODE: '/SPB.PredictionModel.2022.zip',
  DISSERTATION: '/Aoki-Dissertation.pdf',
  ANNUAL: '/SPB.southwide.Annual.1988-2021.zip',
  UTILITY_RELIABILITY: '/2023_SPB-predictions.Utility-Reliabililty.v07.pdf',
  WEEKLY_OLD: '/SPB.southwide.Weekly.1987-2011.zip',
  WEEKLY: '/SPB.southwide.Weekly.2011-2017.zip',
};

const RESOURCE_LOCAL_ROOTS = {
  PROD: 'https://www.spbpredict.com',
  DEV: 'https://pine-beetle-prediction.netlify.app',
};

const getResourceLocalRoot = () => {
  switch (process.env.RESOURCE_ENV) {
    case 'DEV':
      return RESOURCE_LOCAL_ROOTS.DEV;

    case 'PROD':
      return RESOURCE_LOCAL_ROOTS.PROD;

    default:
      return RESOURCE_LOCAL_ROOTS.DEV;
  }
};

const RESOURCE_LOCAL_ROOT = getResourceLocalRoot();

const RESOURCE_LOCAL_URLS = {
  CODE: RESOURCE_LOCAL_ROOT + RESOURCE_ROUTES.CODE,
  DISSERTATION: RESOURCE_LOCAL_ROOT + RESOURCE_ROUTES.DISSERTATION,
  ANNUAL: RESOURCE_LOCAL_ROOT + RESOURCE_ROUTES.ANNUAL,
  UTILITY_RELIABILITY: RESOURCE_LOCAL_ROOT + RESOURCE_ROUTES.UTILITY_RELIABILITY,
  WEEKLY_OLD: RESOURCE_LOCAL_ROOT + RESOURCE_ROUTES.WEEKLY_OLD,
  WEEKLY: RESOURCE_LOCAL_ROOT + RESOURCE_ROUTES.WEEKLY,
};

const RESOURCE_REMOTE_ROOTS = {
  DEV: 'https://raw.githubusercontent.com/dali-lab/pine-beetle-frontend/dev/downloads',
  PROD: 'https://raw.githubusercontent.com/dali-lab/pine-beetle-frontend/release/downloads',
};

const getResourceRemoteRoot = () => {
  switch (process.env.RESOURCE_ENV) {
    case 'DEV':
      return RESOURCE_REMOTE_ROOTS.DEV;

    case 'PROD':
      return RESOURCE_REMOTE_ROOTS.PROD;

    default:
      return RESOURCE_REMOTE_ROOTS.DEV;
  }
};

const RESOURCE_REMOTE_ROOT = getResourceRemoteRoot();

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
  return Array(end - start + 1).fill().map((_, idx) => start + idx);
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

export {
  AUTOMATION_SERVER_ENDPOINTS,
  CHART_MODES,
  DATA_MODES,
  DATA_TYPE_EXTENSIONS,
  DOWNLOAD_DATA_ROUTES,
  getAutomationServerUrl,
  getServerUrl,
  LOCAL_STORAGE_KEYS,
  MIN_WIDTH_THRESHOLD,
  MAP_SOURCES,
  MAP_SOURCE_NAME,
  ROUTES,
  SERVER_ENDPOINTS,
  SOURCE_LAYERS,
  stateAbbrevToStateId,
  stateAbbrevToStateName,
  stateAbbrevToZoomLevel,
  stateNameToAbbrev,
  STATE_VECTOR_LAYER,
  getYearRange,
  RESOURCE_ROUTES,
  RESOURCE_REMOTE_URLS,
  RESOURCE_LOCAL_URLS,
  VIDEO_URL,
  VECTOR_LAYER,
};
