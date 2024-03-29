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
