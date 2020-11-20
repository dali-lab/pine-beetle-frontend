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

const getServerUrl = () => {
  switch (window.location.origin) {
    case 'http://localhost:8080':
      return SERVER_ENDPOINTS.DEV; // could to LOCAL if running server locally

    case 'https://pine-beetle-prediction-dev.netlify.app/':
      return SERVER_ENDPOINTS.DEV;

    case 'https://pine-beetle-prediction.netlify.app/':
      return SERVER_ENDPOINTS.PROD;

    default:
      return SERVER_ENDPOINTS.DEV;
  }
};

const getAutomationServerUrl = () => {
  switch (window.location.origin) {
    case 'http://localhost:8080':
      return AUTOMATION_SERVER_ENDPOINTS.DEV; // could to LOCAL if running server locally

    case 'https://pine-beetle-prediction-dev.netlify.app/':
      return AUTOMATION_SERVER_ENDPOINTS.DEV;

    case 'https://pine-beetle-prediction.netlify.app/':
      return AUTOMATION_SERVER_ENDPOINTS.PROD;

    default:
      return AUTOMATION_SERVER_ENDPOINTS.DEV;
  }
};

const DATA_MODES = {
  COUNTY: 'COUNTY',
  RANGER_DISTRICT: 'RANGER_DISTRICT',
};

const ROUTES = {
  ABOUT: '/about',
  ADMIN: '/admin',
  HISTORICAL_DATA: '/historical-data',
  HOME: '/',
  HOW_IT_WORKS: '/how-it-works',
  PLAY_WITH_MODEL: '/play-with-model',
  PREDICTIONS: '/predictions',
};

export {
  AUTH_TOKEN_KEY,
  DATA_MODES,
  AUTOMATION_SERVER_ENDPOINTS,
  SERVER_ENDPOINTS,
  getAutomationServerUrl,
  getServerUrl,
  stateAbbrevToStateName,
  stateAbbrevToStateId,
  stateAbbrevToZoomLevel,
  ROUTES,
};
