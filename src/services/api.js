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
    endobrev: +endobrev,
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

export async function getCountyScatterChart(filters = {}) {
  const params = toQueryParams({
    ...filters,
    county: filters.county && Array.isArray(filters.county) ? filters.county.join(',') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join(',') : filters.rangerDistrict,
  });
  const url = `${global.API_URL}/${COUNTY_SUBROUTE}/counties/scatter-chart${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRDScatterChart(filters = {}) {
  const params = toQueryParams({
    ...filters,
    county: filters.county && Array.isArray(filters.county) ? filters.county.join(',') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join(',') : filters.rangerDistrict,
  });
  const url = `${global.API_URL}/${RANGERDISTRICT_SUBROUTE}/rangerDistricts/scatter-chart${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves unsummarized trapping data from v3 endpoint
 * @param {Object} filters optional filters (startYear, endYear, state, county, rangerDistrict, etc.)
 * @returns {Promise<Array>} API response with unsummarized data
 */
export async function getUnsummarizedData(filters = {}) {

  const params = toQueryParams({
    ...filters,
    county: filters.county && Array.isArray(filters.county) ? filters.county.join(',') : filters.county,
    rangerDistrict: filters.rangerDistrict && Array.isArray(filters.rangerDistrict) ? filters.rangerDistrict.join(',') : filters.rangerDistrict,
  });

  const baseUrl = global.API_URL.endsWith('/') ? global.API_URL.slice(0, -1) : global.API_URL;
  const endpoint = baseUrl.endsWith('/v3')
    ? 'unsummarized-trapping'
    : 'v3/unsummarized-trapping';
  const url = `${baseUrl}/${endpoint}${params ? `?${params}` : ''}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    const { data } = response;

    let resultData = null;
    if (data && data.status === 200 && data.type === 'SUCCESS' && Array.isArray(data.data)) {
      resultData = data.data;
    } else if (Array.isArray(data)) {
      resultData = data;
    } else if (data && data.data && Array.isArray(data.data)) {
      resultData = data.data;
    } else if (data && data.status && data.status !== 200) {
      const errorMessage = data.error || data.message || `API returned status ${data.status}`;
      throw new Error(errorMessage);
    } else {
      throw new Error('Unexpected response format from unsummarized-trapping endpoint');
    }

    return resultData;
  } catch (error) {
    if (error.response) {
      const { status, data: errorData } = error.response;
      const errorMessage = errorData?.error || errorData?.message || `HTTP ${status}: ${error.message}`;
      console.error('Error fetching unsummarized trapping data:', {
        url,
        status,
        error: errorMessage,
        response: errorData,
      });
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error('Error fetching unsummarized trapping data: No response received', { url });
      throw new Error('No response from server. Please check your connection.');
    } else {
      console.error('Error fetching unsummarized trapping data:', error.message);
      throw error;
    }
  }
}
