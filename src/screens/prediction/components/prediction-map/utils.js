export const thresholds = ['0-2.5%', '2.5-5%', '5-15%', '15-25%', '25-40%', '40-100%'];
export const colors = ['#86CCFF', '#FFC148', '#FFA370', '#FF525C', '#CB4767', '#6B1B38'];

export const MAP_SOURCES = {
  COUNTY: {
    type: 'vector',
    url: 'mapbox://pine-beetle-prediction.1be58pyi',
  },
  RANGER_DISTRICT: {
    type: 'vector',
    url: 'mapbox://pine-beetle-prediction.0tor8eeq',
  },
};

export const SOURCE_LAYERS = {
  COUNTY: 'US_Counties_updated',
  RANGER_DISTRICT: 'RD_SPB_NE',
};

export const MAP_SOURCE_NAME = 'counties';
export const VECTOR_LAYER = 'prediction-chloropleth-layer';
export const STATE_VECTOR_LAYER = 'states';
