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

  return Object.entries(cleanedObj).map(([key, value]) => `${key}=${value}`).join('&');
};

/**
 * @description downloads trapping data as csv
 * @param {string} dataType the type of data we want to download, i.e. UNSUMMARIZED, SUMMARIZED_COUNTY, etc.
 * @param {Object} [queryParams={}] object of query parameters
 * @throws {Error} if dataType is not a valid download route
 */
export const downloadCsv = async (dataType, queryParams = {}) => {
  // Validate dataType to prevent unexpected behavior
  if (!DOWNLOAD_DATA_ROUTES[dataType]) {
    throw new Error(`Invalid dataType: ${dataType}. Must be one of: ${Object.keys(DOWNLOAD_DATA_ROUTES).join(', ')}`);
  }

  // generate url
  const query = toQueryParams(queryParams);
  const url = `${global.AUTOMATION_API_URL}${DOWNLOAD_DATA_ROUTES[dataType]}${query.length > 0 ? '?' : ''}${query}`;

  // download blob and create object url
  const { data } = await axios.get(url, { responseType: 'blob' });
  const objectUrl = URL.createObjectURL(data);

  try {
    // generate link for browser to click (allows us to set the name of the file)
    const link = document.createElement('a');
    link.href = objectUrl;
    const fileExtension = DATA_TYPE_EXTENSIONS[data.type] || 'csv';
    link.setAttribute('download', `${dataType}.${fileExtension}`);

    // trigger download then remove from DOM
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    // Always revoke object URL to prevent memory leaks
    URL.revokeObjectURL(objectUrl);
  }
};
