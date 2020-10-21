const SERVER_ENDPOINTS = {
  LOCAL: 'http://localhost:9090/v2',
  DEV: 'https://pine-beetle-prediction-dev.herokuapp.com/v2',
  PROD: 'https://pine-beetle-prediction.herokuapp.com/v2',
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

    case 'https://pine-beetle-prediction.surge.sh/':
      return SERVER_ENDPOINTS.PROD;

    default:
      return SERVER_ENDPOINTS.DEV;
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
  SERVER_ENDPOINTS,
  getServerUrl,
  stateAbbrevToStateName,
  stateAbbrevToStateId,
  stateAbbrevToZoomLevel,
  ROUTES,
};
