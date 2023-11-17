import { connect } from 'react-redux';

import { createBlogPost } from '../../../../state/actions';
import AddBlogPost from './component';

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    createBlogPost: (fields) => {
      dispatch(createBlogPost(fields));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBlogPost);
