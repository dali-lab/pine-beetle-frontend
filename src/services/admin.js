import axios from 'axios';

import * as userService from './user';

import {
  getAuthTokenFromStorage,
  getUserIdFromStorage,
  toQueryParams,
} from '../utils';

const SUBROUTES = {
  PIPELINE: 'pipeline',
  SPOT_DATA_COUNTY: 'spot-data-county',
  SPOT_DATA_RD: 'spot-data-rangerdistrict',
  SURVEY123: 'survey123',
};

/**
 * @description uploads spot data county csv
 * @param {File} file csv to upload
 * @returns {Promise<Object>} API response
 */
export const uploadCountySpotCsv = async (file) => {
  const url = `${global.AUTOMATION_API_URL}/${SUBROUTES.SPOT_DATA_COUNTY}/upload`;
  const token = getAuthTokenFromStorage();

  const formData = new FormData();
  formData.append('csv', file);

  try {
    const { data: { data } } = await axios.post(url, formData, {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * @description uploads spot data ranger district csv
 * @param {File} file csv to upload
 * @returns {Promise<Object>} API response
 */
export const uploadRangerDistrictSpotCsv = async (file) => {
  const url = `${global.AUTOMATION_API_URL}/${SUBROUTES.SPOT_DATA_RD}/upload`;
  const token = getAuthTokenFromStorage();

  const formData = new FormData();
  formData.append('csv', file);

  try {
    const { data: { data } } = await axios.post(url, formData, {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * @description uploads survey123 unsummarized csv
 * @param {File} file csv to upload
 * @returns {Promise<Object>} API response
 */
export const uploadSurvey123UnsummarizedCsv = async (file) => {
  const url = `${global.AUTOMATION_API_URL}/${SUBROUTES.SURVEY123}/upload`;
  const token = getAuthTokenFromStorage();

  const formData = new FormData();
  formData.append('csv', file);

  try {
    const { data: { data } } = await axios.post(url, formData, {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * @description retrieves all user info
 * @returns {Promise<Object>} API response
 */
export const runPipeline = async (state, year) => {
  const queryParams = toQueryParams({ state, year });

  const url = `${global.AUTOMATION_API_URL}/${SUBROUTES.PIPELINE}${state || year ? `?${queryParams}` : ''}`;
  const token = getAuthTokenFromStorage();

  try {
    const { data: response } = await axios.get(url, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const { data } = response;

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * @description add admin user to system
 * @param {String} email user email
 * @param {String} password user password (plain text)
 * @param {String} firstName user first name
 * @param {String} lastName user last name
 */
export const addAdminUser = async (email, password, firstName, lastName) => {
  const { user } = await userService.signUp(email, password, firstName, lastName);
  return user;
};

/**
 * @description gets all admin users
 */
export const getAllAdminUsers = async () => {
  return userService.getAllUsers();
};

/**
 * @description updates user password
 * @param {String} email current user email
 * @param {String} currentPassord current user password
 * @param {String} password new password to set
 * @returns {Promise<Object>} API response
 */
export const updatePassword = async (email, currentPassword, password) => {
  await userService.login(email, currentPassword);
  return userService.updateUser(getUserIdFromStorage(), { password });
};

/**
 * @description sends forgot password email
 * @param {String} email user email to send to
 * @returns {Promise<Object>} API response
 */
export const sendForgotPasswordEmail = async (email) => {
  return userService.sendForgotPasswordEmail(email);
};
