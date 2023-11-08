import axios from 'axios';

import {
  getAuthTokenFromStorage, getUserIdFromStorage,
} from '../utils';

const SUBROUTE = 'blog';

export const createBlogPost = async () => {};

export const getAllBlogPosts = async () => {
  const url = `${global.API_URL}/${SUBROUTE}`;

  try {
    console.log('req');
    const { data: response } = await axios.get(url);
    console.log('res');

    const { data } = response;

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllBlogPostsByAuthor = async () => {
  const userId = getUserIdFromStorage();
  const url = `${global.API_URL}/${SUBROUTE}/user/${userId}`;
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
    console.error(error);
    throw error;
  }
};

export const editBlogPost = async (id, fields) => {
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
    console.error(error);
    throw error;
  }
};

export const deleteBlogPost = async (id) => {
  const url = `${global.API_URL}/${SUBROUTE}/${id}`;
  const token = getAuthTokenFromStorage();

  try {
    const { data: response } = await axios.delete(url, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const { data } = response;

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
