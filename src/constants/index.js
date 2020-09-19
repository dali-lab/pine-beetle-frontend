const SERVER_ENDPOINTS = {
    LOCAL: 'http://localhost:9090/v1/',
    DEV: 'https://pine-beetle-prediction-dev.herokuapp.com/v1/',
    PROD: 'https://pine-beetle-prediction.herokuapp.com/v1/'
};

const getServerUrl = () => {
    switch (window.location.origin) {
        case 'http://localhost:3000':
          return SERVER_ENDPOINTS.DEV; // could to LOCAL if running server locally
    
        case 'https://pine-beetle-prediction-dev.netlify.app/':
          return SERVER_ENDPOINTS.DEV;
    
        case 'https://pine-beetle-prediction.surge.sh/':
          return SERVER_ENDPOINTS.PROD;
    
        default:
          return SERVER_ENDPOINTS.PROD;
      }
}

export {
    SERVER_ENDPOINTS,
    getServerUrl
}
