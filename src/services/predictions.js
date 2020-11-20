import axios from 'axios';

import { toQueryParams } from '../utils';
import { getAutomationServerUrl } from '../constants';

const COUNTY_SUBROUTE = 'county-prediction';
const RD_SUBROUTE = 'rd-prediction';
const R_MODEL_SUBROUTE = 'r-model';

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

/**
 * @description runs R model on custom input
 * @param {Number} cleridst1 num clerids in last year
 * @param {Number} spotst1 num spots in last year
 * @param {Number} spotst2 num spots two years ago
 * @param {Number} SPB num spb this year
 * @param {Number|Boolean} endobrev whether or not endobrev was used
 * @returns {Promise<Object>} model results
 */
export const runCustomPrediction = async (cleridst1, spotst1, spotst2, SPB, endobrev) => {
  const params = toQueryParams({
    cleridst1,
    endobrev: +endobrev, // note: this casts true to 1 and false to 0 if it is a boolean
    SPB,
    spotst1,
    spotst2,
  });

  const url = `${getAutomationServerUrl()}/${R_MODEL_SUBROUTE}/${params ? `?${params}` : ''}`;

  try {
    const { data: { data } } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
