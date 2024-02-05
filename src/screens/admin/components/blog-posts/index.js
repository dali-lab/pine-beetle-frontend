import { connect } from 'react-redux';

import BlogPosts from './component';
import { deleteBlogPost, editBlogPost, getAllBlogPostsByAuthor } from '../../../../state/actions';

const mapStateToProps = (state) => {
  const {
    blog: {
      blogPostsByUser: blogPosts,
    },
  } = state;

  return {
    blogPosts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllBlogPostsByAuthor: (onSuccess, onError) => {
      dispatch(getAllBlogPostsByAuthor(onSuccess, onError));
    },
    editBlogPost: (id, fields, onSuccess) => {
      dispatch(editBlogPost(id, fields, onSuccess));
    },
    deleteBlogPost: (id, onSuccess) => {
      dispatch(deleteBlogPost(id, onSuccess));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BlogPosts);
