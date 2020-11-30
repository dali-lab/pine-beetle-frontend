import axios from 'axios';

import {
  getAuthTokenFromStorage,
  getUserIdFromStorage,
  removeAuthTokenFromStorage,
  removeUserIdFromStorage,
  setAuthTokenInStorage,
  setUserIdInStorage,
} from '../utils';

const SUBROUTE = 'user';

/**
 * @description logs the user in and sets the local auth token
 * @param {String} email user email
 * @param {String} password user password (plain text)
 * @returns {Promise<Object>} API response
 */
export const login = async (email, password) => {
  const url = `${global.API_URL}/${SUBROUTE}/login`;

  try {
    const { data: response } = await axios.get(url, {
      auth: {
        username: email,
        password,
      },
    });

    const { data } = response;

    if (data) {
      setAuthTokenInStorage(data.token);
      setUserIdInStorage(data.user._id);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * @description signs user up with account
 * @param {String} email user email
 * @param {String} password user password (plain text)
 * @param {String} firstName user first name
 * @param {String} lastName user lastname
 * @returns {Promise<Object>} API response
 */
export const signUp = async (email, password, firstName, lastName) => {
  const url = `${global.API_URL}/${SUBROUTE}/sign-up`;
  const token = getAuthTokenFromStorage();

  try {
    const { data: { data } } = await axios.post(url, {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    }, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * @description signs user out (clears storage token)
 */
export const signOut = () => {
  removeAuthTokenFromStorage();
  removeUserIdFromStorage();
};

/**
 * @description retrieves user info
 * @param {String} id user id
 * @returns {Promise<Object>} API response
 */
export const getUser = async (id) => {
  const url = `${global.API_URL}/${SUBROUTE}/${id}`;
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
 * @description retrieves user info
 * @returns {Promise<Object>} API response
 */
export const getUserFromStorage = async () => {
  const id = getUserIdFromStorage();
  const token = getAuthTokenFromStorage();

  if (!id || !token) throw new Error('Missing user id or user token');

  const url = `${global.API_URL}/${SUBROUTE}/${id}`;

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
 * @description updates user info
 * @param {String} id user id
 * @param {Object} fields fields to update
 * @returns {Promise<Object>} API response
 */
export const updateUser = async (id, fields) => {
  const url = `${global.API_URL}/${SUBROUTE}/${id}`;
  const token = getAuthTokenFromStorage();

  try {
    const { data: response } = await axios.put(url, fields, {
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
 * @description retrieves all user info
 * @returns {Promise<Object>} API response
 */
export const getAllUsers = async () => {
  const url = `${global.API_URL}/${SUBROUTE}`;
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
