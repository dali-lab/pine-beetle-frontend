const SERVER_ENDPOINTS = {
  LOCAL: 'http://localhost:9090/v2',
  DEV: 'https://pine-beetle-prediction-dev.herokuapp.com/v2',
  PROD: 'https://pine-beetle-prediction.herokuapp.com/v2',
};

const AUTOMATION_SERVER_ENDPOINTS = {
  LOCAL: 'http://localhost:9091/v2',
  DEV: 'https://pine-beetle-automation-dev.herokuapp.com/v2',
  PROD: 'https://pine-beetle-automation.herokuapp.com/v2',
};

// map of state abbreviations to their names
const stateAbbrevToStateName = require('./state-abbreviations.json');
const stateAbbrevToStateId = require('./state-ids.json');
const stateAbbrevToZoomLevel = require('./state-zoom-levels.json');

const getServerUrl = () => {
  switch (window.location.origin) {
    case 'http://localhost:8080':
      return SERVER_ENDPOINTS.DEV; // could to LOCAL if running server locally

    case 'https://pine-beetle-prediction-dev.netlify.app':
      return SERVER_ENDPOINTS.DEV;

    case 'https://pine-beetle-prediction.netlify.app':
      return SERVER_ENDPOINTS.PROD;

    default:
      return SERVER_ENDPOINTS.DEV;
  }
};

const getAutomationServerUrl = () => {
  switch (window.location.origin) {
    case 'http://localhost:8080':
      return AUTOMATION_SERVER_ENDPOINTS.DEV; // could to LOCAL if running server locally

    case 'https://pine-beetle-prediction-dev.netlify.app':
      return AUTOMATION_SERVER_ENDPOINTS.DEV;

    case 'https://pine-beetle-prediction.netlify.app':
      return AUTOMATION_SERVER_ENDPOINTS.PROD;

    default:
      return AUTOMATION_SERVER_ENDPOINTS.DEV;
  }
};

const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'DALI_PB_AUTH_TOKEN',
  CHART_MODE: 'DALI_PB_CHART_MODE',
  COUNTY: 'DALI_PB_COUNTY',
  DATA_MODE: 'DALI_PB_DATA_MODE',
  END_YEAR: 'DALI_PB_YEAR_RANGE_MAX',
  RANGER_DISTRICT: 'DALI_PB_RANGER_DISTRICT',
  START_YEAR: 'DALI_PB_YEAR_RANGE_MIN',
  STATE: 'DALI_PB_STATE',
  USER_ID: 'DALI_PB_AUTH_USER_ID',
  YEAR: 'DALI_PB_YEAR',
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
  ADMIN: '/admin',
  TRAPPING_DATA: '/trapping-data',
  HOME: '/',
  PLAY_WITH_MODEL: '/play-with-model',
  PREDICTIONS: '/predict-outbreak',
};

const DOWNLOAD_DATA_ROUTES = {
  UNSUMMARIZED: '/unsummarized-trapping/download',
  SUMMARIZED_COUNTY: '/summarized-county-trapping/download',
  SUMMARIZED_RD: '/summarized-rangerdistrict-trapping/download',
  PREDICTION_COUNTY: '/county-prediction/download',
  PREDICTION_RD: '/rd-prediction/download',
  HELPER: '/data-download/helper-data',
};

export {
  AUTOMATION_SERVER_ENDPOINTS,
  CHART_MODES,
  DATA_MODES,
  DOWNLOAD_DATA_ROUTES,
  getAutomationServerUrl,
  getServerUrl,
  LOCAL_STORAGE_KEYS,
  ROUTES,
  SERVER_ENDPOINTS,
  stateAbbrevToStateId,
  stateAbbrevToStateName,
  stateAbbrevToZoomLevel,
};
