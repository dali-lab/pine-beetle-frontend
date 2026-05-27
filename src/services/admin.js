import axios from 'axios';

import * as userService from './user';

import {
  getAuthTokenFromStorage,
  getUserIdFromStorage,
  toQueryParams,
} from '../utils';

const SUBROUTES = {
  PIPELINE: 'pipeline',
  SPOT_DATA_COUNTY: 'summarized-county/spots/upload',
  SPOT_DATA_RD: 'summarized-rangerdistrict/spots/upload',
  SURVEY123: 'survey123/upload',
  HISTOGRAM: 'histogram',
  UPLOAD_AUDIT: 'upload-audit',
};

const postCsv = async (path, file) => {
  const url = `${global.AUTOMATION_API_URL}/${path}`;
  const token = getAuthTokenFromStorage();
  const formData = new FormData();
  formData.append('csv', file);
  const { data: { data } } = await axios.post(url, formData, {
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const uploadCountySpotCsv = (file) => postCsv(SUBROUTES.SPOT_DATA_COUNTY, file);
export const previewCountySpotCsv = (file) => postCsv(`${SUBROUTES.SPOT_DATA_COUNTY}/preview`, file);

export const uploadRangerDistrictSpotCsv = (file) => postCsv(SUBROUTES.SPOT_DATA_RD, file);
export const previewRangerDistrictSpotCsv = (file) => postCsv(`${SUBROUTES.SPOT_DATA_RD}/preview`, file);

export const previewSurvey123UnsummarizedCsv = (file) => postCsv(`${SUBROUTES.SURVEY123}/preview`, file);

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

const getSurvey123UploadStatus = async (uploadId) => {
  const url = `${global.AUTOMATION_API_URL}/${SUBROUTES.SURVEY123}/status?uploadId=${encodeURIComponent(uploadId)}`;
  const token = getAuthTokenFromStorage();
  const { data: { data } } = await axios.get(url, {
    headers: { authorization: `Bearer ${token}` },
  });
  return data; // { status, message, result }
};

/**
 * @description uploads a Survey123 CSV. The endpoint returns 202 + uploadId and
 * processes in the background, so we poll the status endpoint and only resolve
 * once processing finishes (or reject if it failed). This keeps the UI honest
 * ("uploading" until truly done) and lets the caller refresh history once.
 */
export const uploadSurvey123UnsummarizedCsv = async (file) => {
  const { uploadId } = await postCsv(SUBROUTES.SURVEY123, file);
  if (!uploadId) return { uploadId: null };

  const intervalMs = 2000;
  const timeoutMs = 60000;
  const start = Date.now();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const status = await getSurvey123UploadStatus(uploadId);
    if (status?.status === 'success') return status.result || { uploadId };
    if (status?.status === 'error') throw new Error(status.message || 'Upload failed');
    if (Date.now() - start > timeoutMs) return { uploadId, pending: true };
    // eslint-disable-next-line no-await-in-loop
    await sleep(intervalMs);
  }
};

/**
 * @description lists upload audit entries (paginated)
 */
export const getUploadHistory = async ({
  page = 1,
  limit = 50,
  status,
  source,
} = {}) => {
  const params = toQueryParams({
    page, limit, status, source,
  });
  const url = `${global.AUTOMATION_API_URL}/${SUBROUTES.UPLOAD_AUDIT}?${params}`;
  const token = getAuthTokenFromStorage();
  const { data: { data } } = await axios.get(url, {
    headers: { authorization: `Bearer ${token}` },
  });
  return data;
};

/**
 * @description fetches a single audit entry (with full skipped/rejected lists)
 */
export const getUploadAudit = async (uploadId) => {
  const url = `${global.AUTOMATION_API_URL}/${SUBROUTES.UPLOAD_AUDIT}/${uploadId}`;
  const token = getAuthTokenFromStorage();
  const { data: { data } } = await axios.get(url, {
    headers: { authorization: `Bearer ${token}` },
  });
  return data;
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
 * @description deletes user with given id
 * @param {String} id user id
 * @returns {Promise<Object>} API response
 */
export const deleteAdminUser = async (id) => {
  return userService.deleteUser(id);
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

/**
 * @description update the histogram data with new trapping data
 * @returns {Promise<Object>} API response
 */
export const updateHistogram = async () => {
  const url = `${global.API_URL}/${SUBROUTES.HISTOGRAM}/update`;
  const token = getAuthTokenFromStorage();

  try {
    const { data: response } = await axios.post(url, {}, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const { data } = response;

    return data;
  } catch (error) {
    console.error(error); throw error;
  }
};
