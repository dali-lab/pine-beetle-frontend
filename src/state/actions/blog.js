import { blog as BlogService } from '../../services';

export const ActionTypes = {
  API_ERROR: 'API_ERROR',
  CLEAR_API_ERROR: 'CLEAR_API_ERROR',
  SET_BLOG_POSTS_BY_USER_DATA: 'SET_BLOG_POSTS_BY_USER_DATA',
  GET_ALL_BLOG_POSTS: 'GET_ALL_BLOG_POSTS',
  EDIT_BLOG_POST: 'EDIT_BLOG_POST',
  DELETE_BLOG_POST: 'DELETE_BLOG_POST',
  CREATE_BLOG_POST: 'CREATE_BLOG_POST',
};

export const createBlogPost = (fields, onSuccess = () => {}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.CLEAR_API_ERROR });
      const createdBlogPost = await BlogService.createBlogPost(fields);
      dispatch({ type: ActionTypes.CREATE_BLOG_POST, payload: createdBlogPost });
      onSuccess();
    } catch (error) {
      dispatch({
        type: ActionTypes.API_ERROR,
        payload: {
          action: 'CREATE BLOG POST',
          error,
        },
      });
    }
  };
};

export const getAllBlogPosts = () => {
  return async (dispatch) => {
    try {
      const blogPosts = await BlogService.getAllBlogPosts();
      dispatch({ type: ActionTypes.GET_ALL_BLOG_POSTS, payload: blogPosts });
    } catch (error) {
      dispatch({
        type: ActionTypes.API_ERROR,
        payload: 'GET ALL BLOG POSTS',
        error,
      });
    }
  };
};

export const getAllBlogPostsByAuthor = (onSuccess = () => {}, onError = () => {}) => {
  return async (dispatch) => {
    try {
      const blogPosts = await BlogService.getAllBlogPostsByAuthor();
      dispatch({ type: ActionTypes.SET_BLOG_POSTS_BY_USER_DATA, payload: blogPosts });
      onSuccess();
    } catch (error) {
      dispatch({
        type: ActionTypes.API_ERROR,
        payload: {
          action: 'GET ALL BLOG POSTS BY USER',
          error,
        },
      });
      onError(error);
    }
  };
};

export const editBlogPost = (id, fields, onSuccess = () => {}) => {
  return async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.CLEAR_API_ERROR });

      const editedBlogPost = await BlogService.editBlogPost(id, fields);
      dispatch({ type: ActionTypes.EDIT_BLOG_POST, payload: editedBlogPost });
      onSuccess();
    } catch (error) {
      dispatch({
        type: ActionTypes.API_ERROR,
        payload: {
          action: 'EDIT BLOG POST',
          error,
        },
      });
    }
  };
};

export const deleteBlogPost = (id, onSuccess = () => {}) => {
  return async (dispatch) => {
    try {
      const response = await BlogService.deleteBlogPost(id);
      if (response.status === 200) {
        dispatch({ type: ActionTypes.DELETE_BLOG_POST, payload: { _id: id } });
        onSuccess();
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.API_ERROR,
        payload: {
          action: 'DELETE BLOG POST',
          error,
        },
      });
    }
  };
};
