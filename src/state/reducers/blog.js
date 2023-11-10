import { ActionTypes } from '../actions';

const initialState = {
  blogPostsByUser: [],
};

const BlogReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_BLOG_POSTS_BY_USER_DATA:
      return { ...state, blogPostsByUser: action.payload };

    case ActionTypes.EDIT_BLOG_POST: {
      const updatedBlogPosts = state.blogPostsByUser.map((post) => (post._id === action.payload._id ? action.payload : post));
      return { ...state, blogPostsByUser: updatedBlogPosts };
    }

    case ActionTypes.DELETE_BLOG_POST: {
      const filteredBlogPosts = state.blogPostsByUser.filter((post) => post._id !== action.payload._id);
      return { ...state, blogPostsByUser: filteredBlogPosts };
    }

    default:
      return state;
  }
};

export default BlogReducer;
