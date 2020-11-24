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

const AUTH_TOKEN_KEY = 'DALI_PB_AUTH_TOKEN';
const AUTH_USER_ID = 'DALI_PB_AUTH_USER_ID';

const DATA_MODE_KEY = 'DALI_PB_DATA_MODE';
const CHART_MODE_KEY = 'DALI_PB_CHART_MODE';

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
  AUTH_TOKEN_KEY,
  AUTH_USER_ID,
  AUTOMATION_SERVER_ENDPOINTS,
  CHART_MODE_KEY,
  CHART_MODES,
  DATA_MODE_KEY,
  DATA_MODES,
  DOWNLOAD_DATA_ROUTES,
  getAutomationServerUrl,
  getServerUrl,
  ROUTES,
  SERVER_ENDPOINTS,
  stateAbbrevToStateId,
  stateAbbrevToStateName,
  stateAbbrevToZoomLevel,
};
