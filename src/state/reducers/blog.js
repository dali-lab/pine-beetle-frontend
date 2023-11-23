import { ActionTypes } from '../actions';

const initialState = {
  blogPostsByUser: [],
  error: null,
};

const BlogReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CREATE_BLOG_POST: {
      const updatedBlogPostsByUser = state.blogPostsByUser.concat([action.payload]);
      return { ...state, blogPostsByUser: updatedBlogPostsByUser };
    }

    case ActionTypes.SET_BLOG_POSTS_BY_USER_DATA:
      return { ...state, blogPostsByUser: action.payload };

    case ActionTypes.EDIT_BLOG_POST: {
      const updatedBlogPosts = state.blogPostsByUser.map(
        (post) => (post._id === action.payload._id
          ? action.payload
          : post),
      );
      return { ...state, blogPostsByUser: updatedBlogPosts };
    }

    case ActionTypes.DELETE_BLOG_POST: {
      const filteredBlogPosts = state.blogPostsByUser.filter((post) => post._id !== action.payload._id);
      return { ...state, blogPostsByUser: filteredBlogPosts };
    }

    case ActionTypes.API_ERROR:
      return { ...state, error: { message: action.payload.error.response?.data?.error, action: action.payload.action } };

    case ActionTypes.CLEAR_API_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

export default BlogReducer;
