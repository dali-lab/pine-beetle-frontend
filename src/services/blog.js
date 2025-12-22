import axios from 'axios';

import {
  getAuthTokenFromStorage,
  getUserIdFromStorage,
} from '../utils';

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

  try {
    const { data: response } = await axios.get(url);
    const { data } = response;

    return {
      count: data.count || 0,
      userHasLiked: data.userHasLiked || false,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const toggleBlogPostLike = async (postId) => {
  const url = `${global.API_URL}/${SUBROUTE}/${postId}/likes`;

  try {
    const { data: response } = await axios.post(url);
    const { data } = response;

    return {
      count: data.count || 0,
      userHasLiked: data.userHasLiked || false,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getBlogPostComments = async (postId) => {
  const url = `${global.API_URL}/${SUBROUTE}/${postId}/comments`;

  try {
    const { data: response } = await axios.get(url);
    const { data } = response;

    return data.comments || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createBlogPostComment = async (postId, commentData) => {
  const url = `${global.API_URL}/${SUBROUTE}/${postId}/comments`;

  try {
    const { data: response } = await axios.post(url, commentData);
    const { data } = response;

    return data.comment;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
