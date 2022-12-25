import axios from 'axios';

import {
  DOWNLOAD_DATA_ROUTES,
  DATA_TYPE_EXTENSIONS,
} from '../constants';

/**
 * @description casts object to url query params
 * @param {Object} obj generic object to cast
 * @returns {String} string of query params from object
 */
export const toQueryParams = (obj) => {
  // filter out any null/undefined values
  const cleanedObj = Object.entries(obj).reduce((acc, [key, val]) => ({
    ...acc,
    ...(val ? { [key]: val } : {}),
  }), {});

  return Object.entries(cleanedObj).map(([key, value]) => {
    return `${key}=${value}`;
  }).join('&');
};

/**
 * @description downloads trapping data as csv
 * @param {String} dataType the type of data we want to download, i.e. UNSUMMARIZED, SUMMARIZED_COUNTY, etc.
 * @param {Object} [queryParams={}] object of query parameters
 */
export const downloadCsv = async (dataType, queryParams = {}) => {
  // generate url
  const query = toQueryParams(queryParams);

  // const localApi = 'http://localhost:9091/v3';
  const url = `${global.AUTOMATION_API_URL}${DOWNLOAD_DATA_ROUTES[dataType]}${query.length > 0 ? '?' : ''}${query}`;
  // const url = `${localApi}${DOWNLOAD_DATA_ROUTES[dataType]}${query.length > 0 ? '?' : ''}${query}`;
  console.log('route', DOWNLOAD_DATA_ROUTES);
  console.log('dataType', dataType);
  console.log('url', url);

  // download blob and create object url
  const { data } = await axios.get(url, { responseType: 'blob' });
  const objectUrl = URL.createObjectURL(data);

  // generate link for browser to click (allows us to set the name of the file)
  const link = document.createElement('a');
  link.href = objectUrl;
  const fileExtension = DATA_TYPE_EXTENSIONS[data.type] || 'csv';
  link.setAttribute('download', `${dataType}.${fileExtension}`);

  // trigger download then remove from DOM
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
