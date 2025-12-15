import axios from 'axios';

import { DATA_MODES } from '../constants';
import { toQueryParams } from '../utils';

const COUNTY_SUBROUTE = 'summarized-county';
const RANGERDISTRICT_SUBROUTE = 'summarized-rangerdistrict';
const R_MODEL_SUBROUTE = 'r-model';

/**
 * @description retrieves all summarized county data
 * @param {Object} filters optional filters
 * @returns {Promise<Object>} API response
 */
export async function getCountyData(filters) {
  const params = toQueryParams({
    ...filters,
    county: filters.county && Array.isArray(filters.county) ? filters.county.join(',') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join(',') : filters.rangerDistrict,
  });

  const url = `${global.API_URL}/${COUNTY_SUBROUTE}/${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves sparse fields in summarized county data
 * @param {Object} filters optional filters
 * @returns {Promise<Object>} API response
 */
export async function getSparseCountyData(filters) {
  const params = toQueryParams({
    ...filters,
    county: filters.county && Array.isArray(filters.county) ? filters.county.join(',') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join(',') : filters.rangerDistrict,
  });

  const url = `${global.API_URL}/${COUNTY_SUBROUTE}/sparse${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves all summarized ranger district data
 * @param {Object} filters optional filters
 * @returns {Promise<Object>} API response
 */
export async function getRangerDistrictData(filters) {
  const params = toQueryParams({
    ...filters,
    county: filters.county && Array.isArray(filters.county) ? filters.county.join(',') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join(',') : filters.rangerDistrict,
  });

  const url = `${global.API_URL}/${RANGERDISTRICT_SUBROUTE}/${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves sprase fields in ranger district data
 * @param {Object} filters optional filters
 * @returns {Promise<Object>} API response
 */
export async function getSparseRangerDistrictData(filters) {
  const params = toQueryParams({
    ...filters,
    county: filters.county && Array.isArray(filters.county) ? filters.county.join(',') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join(',') : filters.rangerDistrict,
  });

  const url = `${global.API_URL}/${RANGERDISTRICT_SUBROUTE}/sparse${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves sum of spb, clerids, and spots by year
 * @param {Object} [filters={}] optional filters (startYear, endYear, state, county)
 * @returns {Promise<Object>} API response
 */
export async function countyAggregateByYear(filters = {}) {
  const params = toQueryParams({
    ...filters,
    county: filters.county && Array.isArray(filters.county) ? filters.county.join(',') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join(',') : filters.rangerDistrict,
  });

  const url = `${global.API_URL}/${COUNTY_SUBROUTE}/aggregate/year${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves sum of spb, clerids, and spots by state
 * @param {Object} [filters={}] optional filters (startYear, endYear, state, county)
 * @returns {Promise<Object>} API response
 */
export async function countyAggregateByState(filters = {}) {
  const params = toQueryParams({
    ...filters,
    county: filters.county && Array.isArray(filters.county) ? filters.county.join(',') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join(',') : filters.rangerDistrict,
  });

  const url = `${global.API_URL}/${COUNTY_SUBROUTE}/aggregate/state${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves sum of spb, clerids, and spots by county, should provide a state filter for this
 * @param {Object} [filters={}] optional filters (startYear, endYear, state, county)
 * @returns {Promise<Object>} API response
 */
export async function countyAggregateByCounty(filters = {}) {
  const params = toQueryParams({
    ...filters,
    county: filters.county && Array.isArray(filters.county) ? filters.county.join(',') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join(',') : filters.rangerDistrict,
  });

  const url = `${global.API_URL}/${COUNTY_SUBROUTE}/aggregate/county${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves sum of spb, clerids, and spots by year
 * @param {Object} [filters={}] optional filters (startYear, endYear, state, rangerDistrict)
 * @returns {Promise<Object>} API response
 */
export async function rangerDistrictAggregateByYear(filters = {}) {
  const params = toQueryParams({
    ...filters,
    county: filters.county && Array.isArray(filters.county) ? filters.county.join(',') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join(',') : filters.rangerDistrict,
  });

  const url = `${global.API_URL}/${RANGERDISTRICT_SUBROUTE}/aggregate/year${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves sum of spb, clerids, and spots by state
 * @param {Object} [filters={}] optional filters (startYear, endYear, state, rangerDistrict)
 * @returns {Promise<Object>} API response
 */
export async function rangerDistrictAggregateByState(filters = {}) {
  const params = toQueryParams({
    ...filters,
    county: filters.county && Array.isArray(filters.county) ? filters.county.join(',') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join(',') : filters.rangerDistrict,
  });

  const url = `${global.API_URL}/${RANGERDISTRICT_SUBROUTE}/aggregate/state${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves sum of spb, clerids, and spots by RD, should provide a state filter for this
 * @param {Object} [filters={}] optional filters (startYear, endYear, state, rangerDistrict)
 * @returns {Promise<Object>} API response
 */
export async function rangerDistrictAggregateByRangerDistrict(filters = {}) {
  const params = toQueryParams({
    ...filters,
    county: filters.county && Array.isArray(filters.county) ? filters.county.join(',') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join(',') : filters.rangerDistrict,
  });

  const url = `${global.API_URL}/${RANGERDISTRICT_SUBROUTE}/aggregate/rangerDistrict${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description runs R model on custom input
 * @param {Number|string} cleridst1 num clerids in last year
 * @param {Number|string} spotst1 num spots in last year
 * @param {Number|string} spotst2 num spots two years ago
 * @param {Number|string} SPB num spb this year
 * @param {Number|string|Boolean} endobrev whether or not endobrev was used
 * @returns {Promise<Object>} model results
 */
export async function runCustomPrediction(cleridst1, spotst1, spotst2, SPB, endobrev, modelVersion) {
  const params = {
    cleridst1,
    endobrev: +endobrev, // note: this casts true to 1 and false to 0 if it is a boolean
    SPB,
    spotst1,
    spotst2,
    modelVersion,
  };

  const url = `${global.AUTOMATION_API_URL}/${R_MODEL_SUBROUTE}`;

  try {
    const { data: { data } } = await axios.get(url, { params });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves all available years based on data mode
 * @param {String} dataMode the current data mode
 * @param {Object} [filters={}] optional filters
 * @returns {Promise<Object>} API response
 */
export async function getAvailableYears(dataMode, filters = {}) {
  const params = toQueryParams({
    ...filters,
    ...(filters.isHistorical ? { isHistorical: 1 } : {}),
    ...(filters.isPrediction ? { isPrediction: 1 } : {}),
    county: filters.county && Array.isArray(filters.county) ? filters.county.join(',') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join(',') : filters.rangerDistrict,
  });

  const url = `${global.API_URL}/${dataMode === DATA_MODES.COUNTY ? COUNTY_SUBROUTE : RANGERDISTRICT_SUBROUTE}/years/list${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves all available states based on data mode
 * @param {String} dataMode the current data mode
 * @param {Object} [filters={}] optional filters
 * @returns {Promise<Object>} API response
 */
export async function getAvailableStates(dataMode, filters = {}) {
  const params = toQueryParams({
    ...filters,
    ...(filters.isHistorical ? { isHistorical: 1 } : {}),
    ...(filters.isPrediction ? { isPrediction: 1 } : {}),
  });

  const url = `${global.API_URL}/${dataMode === DATA_MODES.COUNTY ? COUNTY_SUBROUTE : RANGERDISTRICT_SUBROUTE}/states/list${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves all available counties or RDs based on data mode
 * @param {String} dataMode the current data mode
 * @param {Object} [filters={}] optional filters
 * @returns {Promise<Object>} API response
 */
export async function getAvailableSublocations(dataMode, filters = {}) {
  const subroute = dataMode === DATA_MODES.COUNTY ? COUNTY_SUBROUTE : RANGERDISTRICT_SUBROUTE;
  const path = dataMode === DATA_MODES.COUNTY ? 'counties' : 'rangerDistricts';

  const params = toQueryParams({
    ...filters,
    ...(filters.isHistorical ? { isHistorical: 1 } : {}),
    ...(filters.isPrediction ? { isPrediction: 1 } : {}),
  });

  const url = `${global.API_URL}/${subroute}/${path}/list${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves all counties with comparison between predicted probability of an outbreak and actual spot data for the last year
 * @param {Object} [filters={}] optional filters (year, state, county)
 * @returns {Promise<Object>} API response
 */
export async function getCountyResultsComparison(filters) {
  const params = toQueryParams({
    ...filters,
    county: filters.county && Array.isArray(filters.county) ? filters.county.join(',') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join(',') : filters.rangerDistrict,
  });
  const url = `${global.API_URL}/${COUNTY_SUBROUTE}/counties/results${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves all ranger districts with comparison between predicted probability of an outbreak and actual spot data for the last year
 * @param {Object} [filters={}] optional filters (year, state, rangerDistrict)
 * @returns {Promise<Object>} API response
 */
export async function getRDResultsComparison(filters) {
  const params = toQueryParams({
    ...filters,
    county: filters.county && Array.isArray(filters.county) ? filters.county.join(',') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join(',') : filters.rangerDistrict,
  });
  const url = `${global.API_URL}/${RANGERDISTRICT_SUBROUTE}/rangerDistricts/results${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getCountyScatterChart() {
  const url = `${global.API_URL}/${COUNTY_SUBROUTE}/counties/scatter-chart`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRDScatterChart() {
  const url = `${global.API_URL}/${RANGERDISTRICT_SUBROUTE}/rangerDistricts/scatter-chart`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves unsummarized trapping data as JSON (same data as download but in JSON format)
 * @param {Object} filters optional filters (startYear, endYear, state, county, rangerDistrict)
 * @returns {Promise<Array>} API response with unsummarized data
 */
export async function getUnsummarizedData(filters) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/2a337e4f-e878-4fa8-92e2-9b11a26435ec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'api.js:420', message: 'getUnsummarizedData entry', data: { filters }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A',
    }),
  }).catch(() => {});
  // #endregion
  const params = toQueryParams({
    ...filters,
    county: filters.county && Array.isArray(filters.county) ? filters.county.join('&county=') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join('&rangerDistrict=') : filters.rangerDistrict,
  });

  // Try to get JSON instead of CSV - use the same endpoint but request JSON
  const url = `${global.AUTOMATION_API_URL}/unsummarized-trapping${params ? `?${params}` : ''}`;
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/2a337e4f-e878-4fa8-92e2-9b11a26435ec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'api.js:428', message: 'getUnsummarizedData URL', data: { url, automationApiUrl: global.AUTOMATION_API_URL, params }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A',
    }),
  }).catch(() => {});
  // #endregion

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
      },
    });
    const { data, headers } = response;
    // #region agent log
    const contentType = headers['content-type'];
    let firstItem = null;
    let firstItemKeys = [];
    if (Array.isArray(data) && data.length > 0) {
      const [first] = data;
      firstItem = first;
      firstItemKeys = Object.keys(first);
    } else if (typeof data === 'object' && data !== null) {
      firstItem = data;
      firstItemKeys = Object.keys(data);
    }
    fetch('http://127.0.0.1:7242/ingest/2a337e4f-e878-4fa8-92e2-9b11a26435ec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'api.js:436',
        message: 'getUnsummarizedData response',
        data: {
          contentType,
          isArray: Array.isArray(data),
          dataType: typeof data,
          hasStatus: data?.status !== undefined,
          hasType: data?.type !== undefined,
          hasDataField: data?.data !== undefined,
          firstItem,
          firstItemKeys,
          dataKeys: typeof data === 'object' && data !== null ? Object.keys(data) : null,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'C',
      }),
    }).catch(() => {});
    // #endregion
    // If response is already an array, return it; otherwise check for data.data
    let result;
    if (Array.isArray(data)) {
      result = data;
    } else if (data && data.data) {
      result = data.data;
    } else {
      result = data;
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/2a337e4f-e878-4fa8-92e2-9b11a26435ec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'api.js:465', message: 'getUnsummarizedData result', data: { resultLength: Array.isArray(result) ? result.length : 'not array', resultType: typeof result, firstResult: Array.isArray(result) && result.length > 0 ? result[0] : result }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C',
      }),
    }).catch(() => {});
    // #endregion
    return result;
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/2a337e4f-e878-4fa8-92e2-9b11a26435ec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'api.js:474',
        message: 'getUnsummarizedData error',
        data: {
          message: error.message, response: error.response?.data, status: error.response?.status, url,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'A',
      }),
    }).catch(() => {});
    // #endregion
    throw error;
  }
}
