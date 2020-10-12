import axios from 'axios';

import { toQueryParams } from '../utils';

const COUNTY_SUBROUTE = 'county-prediction';
const RD_SUBROUTE = 'rd-prediction';

/**
 * @description retrieves all county prediction data
 * @param {Object} filters optional filters
 * @returns {Promise<Object>} API response
 */
export const getAllCountyData = async (filters) => {
  const params = toQueryParams(filters);

  const url = `${global.API_URL}/${COUNTY_SUBROUTE}/${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * @description retrieves all ranger district prediction data
 * @param {Object} filters optional filters
 * @returns {Promise<Object>} API response
 */
export const getAllRDData = async (filters) => {
  const params = toQueryParams(filters);

  const url = `${global.API_URL}/${RD_SUBROUTE}/${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
