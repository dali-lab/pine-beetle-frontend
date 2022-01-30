const MIN_WIDTH_THRESHOLD = 725;

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

const yearsOptions = [
  2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007,
  2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991,
  1990, 1989, 1988,
];

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
  TRAPPING_DATA: '/historical-and-model-input-data',
  HOME: '/',
  PLAY_WITH_MODEL: '/play-with-model',
  PREDICTIONS: '/predict-outbreak',
};

const DOWNLOAD_DATA_ROUTES = {
  '1988-2009 DATA': '/data-download/old-data',
  HELPER: '/data-download/helper-data',
  PREDICTION_COUNTY: '/county-prediction/download',
  PREDICTION_RD: '/rd-prediction/download',
  SUMMARIZED_COUNTY: '/summarized-county-trapping/download',
  SUMMARIZED_RD: '/summarized-rangerdistrict-trapping/download',
  UNSUMMARIZED: '/unsummarized-trapping/download',
};

const DATA_TYPE_EXTENSIONS = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/zip': 'zip',
  'text/csv': 'csv',
};

const VIDEO_URL = 'https://drive.google.com/file/d/1lp0-8pCiAkaXqVclcxjjSx4RcBKGeH3M/preview';

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
  ROUTES,
  SERVER_ENDPOINTS,
  stateAbbrevToStateId,
  stateAbbrevToStateName,
  stateAbbrevToZoomLevel,
  stateNameToAbbrev,
  yearsOptions,
  VIDEO_URL,
};
