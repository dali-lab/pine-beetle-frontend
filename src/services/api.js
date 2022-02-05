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
    ...(filters.county ? { county: filters.county.join(',') } : {}),
    ...(filters.rangerDistrict ? { county: filters.rangerDistrict.join(',') } : {}),
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
 * @description retrieves all summarized ranger district data
 * @param {Object} filters optional filters
 * @returns {Promise<Object>} API response
 */
export async function getRangerDistrictData(filters) {
  const params = toQueryParams({
    ...filters,
    ...(filters.county ? { county: filters.county.join(',') } : {}),
    ...(filters.rangerDistrict ? { county: filters.rangerDistrict.join(',') } : {}),
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
 * @description retrieves sum of spb, clerids, and spots by year
 * @param {Object} [filters={}] optional filters (startYear, endYear, state, county)
 * @returns {Promise<Object>} API response
 */
export async function countyAggregateByYear(filters = {}) {
  const params = toQueryParams({
    ...filters,
    ...(filters.county ? { county: filters.county.join(',') } : {}),
    ...(filters.rangerDistrict ? { county: filters.rangerDistrict.join(',') } : {}),
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
    ...(filters.county ? { county: filters.county.join(',') } : {}),
    ...(filters.rangerDistrict ? { county: filters.rangerDistrict.join(',') } : {}),
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
    ...(filters.county ? { county: filters.county.join(',') } : {}),
    ...(filters.rangerDistrict ? { county: filters.rangerDistrict.join(',') } : {}),
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
    ...(filters.county ? { county: filters.county.join(',') } : {}),
    ...(filters.rangerDistrict ? { county: filters.rangerDistrict.join(',') } : {}),
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
    ...(filters.county ? { county: filters.county.join(',') } : {}),
    ...(filters.rangerDistrict ? { county: filters.rangerDistrict.join(',') } : {}),
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
    ...(filters.county ? { county: filters.county.join(',') } : {}),
    ...(filters.rangerDistrict ? { county: filters.rangerDistrict.join(',') } : {}),
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
 * @param {Number} cleridst1 num clerids in last year
 * @param {Number} spotst1 num spots in last year
 * @param {Number} spotst2 num spots two years ago
 * @param {Number} SPB num spb this year
 * @param {Number|Boolean} endobrev whether or not endobrev was used
 * @returns {Promise<Object>} model results
 */
export async function runCustomPrediction(cleridst1, spotst1, spotst2, SPB, endobrev) {
  const params = toQueryParams({
    ...(cleridst1 ? { cleridst1 } : {}),
    endobrev: +endobrev, // note: this casts true to 1 and false to 0 if it is a boolean
    SPB,
    spotst1,
    spotst2,
  });

  const url = `${global.AUTOMATION_API_URL}/${R_MODEL_SUBROUTE}/${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @description retrieves all available years based on data mode
 * @param {String} dataMode the current data mode
 * @returns {Promise<Object>} API response
 */
export async function getAvailableYears(dataMode) {
  const url = `${global.API_URL}/${dataMode === DATA_MODES.COUNTY ? COUNTY_SUBROUTE : RANGERDISTRICT_SUBROUTE}/years/list`;

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
 * @returns {Promise<Object>} API response
 */
export async function getAvailableStates(dataMode) {
  const url = `${global.API_URL}/${dataMode === DATA_MODES.COUNTY ? COUNTY_SUBROUTE : RANGERDISTRICT_SUBROUTE}/states/list`;

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
 * @param {String} state the state to search on
 * @returns {Promise<Object>} API response
 */
export async function getAvailableSublocations(dataMode, state) {
  const subroute = dataMode === DATA_MODES.COUNTY ? COUNTY_SUBROUTE : RANGERDISTRICT_SUBROUTE;
  const path = dataMode === DATA_MODES.COUNTY ? 'counties' : 'rangerDistricts';
  const queryParams = state ? `?state=${state}` : '';

  const url = `${global.API_URL}/${subroute}/${path}/list${queryParams}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
