const SERVER_ENDPOINTS = {
  LOCAL: 'http://localhost:9090/v2/',
  DEV: 'https://pine-beetle-prediction-dev.herokuapp.com/v2/',
  PROD: 'https://pine-beetle-prediction.herokuapp.com/v2/',
};

const AUTH_TOKEN_KEY = 'DALI_PB_AUTH_TOKEN';

const getServerUrl = () => {
  switch (window.location.origin) {
    case 'http://localhost:3000':
      return SERVER_ENDPOINTS.DEV; // could to LOCAL if running server locally

    case 'https://pine-beetle-prediction-dev.netlify.app/':
      return SERVER_ENDPOINTS.DEV;

    case 'https://pine-beetle-prediction.surge.sh/':
      return SERVER_ENDPOINTS.PROD;

    default:
      return SERVER_ENDPOINTS.DEV;
  }
};

export {
  AUTH_TOKEN_KEY,
  SERVER_ENDPOINTS,
  getServerUrl,
};
