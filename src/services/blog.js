import axios from 'axios';

import {
  getAnonymousId,
  getAuthTokenFromStorage,
  getUserIdFromStorage,
} from '../utils';

// MAIN_BACKEND_URL already includes /v3; keep subroute as /blog
const SUBROUTE = 'blog';

export const createBlogPost = async (fields) => {
  const url = `${global.API_URL}/${SUBROUTE}/create`;
  const token = getAuthTokenFromStorage();
  try {
    const { data: response } = await axios.post(url, fields, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const { data } = response;

    return data.blogPost;
  } catch (error) {
    console.error(error); throw error;
  }
};

export const getAllBlogPosts = async () => {
  const url = `${global.API_URL}/${SUBROUTE}`;

  try {
    const { data: response } = await axios.get(url);

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

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getBlogPostLikes = async (postId) => {
  const url = `${global.API_URL}/${SUBROUTE}/${postId}/likes`;
  const token = getAuthTokenFromStorage();
  const config = {};

  if (token) {
    config.headers = { authorization: `Bearer ${token}` };
  } else {
    config.params = { anonymousId: getAnonymousId() };
  }

  try {
    const { data: response } = await axios.get(url, config);
    const { data } = response || {};

    return {
      count: data?.count ?? 0,
      userHasLiked: data?.userHasLiked ?? false,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const toggleBlogPostLike = async (postId) => {
  const url = `${global.API_URL}/${SUBROUTE}/${postId}/likes`;
  const token = getAuthTokenFromStorage();

  const headers = {};
  let body = {};

  if (token) {
    headers.authorization = `Bearer ${token}`;
  } else {
    body = { anonymousId: getAnonymousId() };
  }

  try {
    const { data: response } = await axios.post(url, body, { headers });
    const { data } = response || {};

    return {
      liked: data?.liked ?? false,
      count: data?.count ?? 0,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getBlogPostComments = async (postId, params = {}) => {
  const url = `${global.API_URL}/${SUBROUTE}/${postId}/comments`;

  try {
    const { data: response } = await axios.get(url, { params });
    const { data } = response || {};

    return data || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createBlogPostComment = async (postId, content, author) => {
  const url = `${global.API_URL}/${SUBROUTE}/${postId}/comments`;
  const token = getAuthTokenFromStorage();
  const config = {};

  if (token) {
    config.headers = { authorization: `Bearer ${token}` };
  }

  const body = { content };
  if (author) {
    body.author = author;
  }

  try {
    const { data: response } = await axios.post(url, body, config);
    const { data } = response || {};

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
