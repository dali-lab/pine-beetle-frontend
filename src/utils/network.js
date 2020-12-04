import axios from 'axios';

import {
  DOWNLOAD_DATA_ROUTES,
} from '../constants';

/**
 * @description casts object to url query params
 * @param {Object} obj generic object to cast
 * @returns {String} string of query params from object
 */
export const toQueryParams = obj => (
  Object.entries(obj).map(([key, value]) => {
    return `${key}=${value}`;
  }).join('&')
);

/**
 * @description downloads trapping data as csv
 * @param {String} dataType the type of data we want to download, i.e. UNSUMMARIZED, SUMMARIZED_COUNTY, etc.
 * @param {Object} [queryParams={}] object of query parameters
 */
export const downloadCsv = async (dataType, queryParams = {}) => {
  // generate url
  const query = toQueryParams(queryParams);
  const url = `${global.AUTOMATION_API_URL}${DOWNLOAD_DATA_ROUTES[dataType]}${query.length > 0 ? '?' : ''}${query}`;

  // download blob and create object url
  const { data } = await axios.get(url, { responseType: 'blob' });
  const objectUrl = URL.createObjectURL(data);

  // generate link for browser to click (allows us to set the name of the file)
  const link = document.createElement('a');
  link.href = objectUrl;

  const dataTypeExtensions = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/zip': 'zip',
    'text/csv': 'csv',
  };

  const fileExtension = dataTypeExtensions[data.type] || 'csv';
  link.setAttribute('download', `${dataType}.${fileExtension}`);

  // trigger download then remove from DOM
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
