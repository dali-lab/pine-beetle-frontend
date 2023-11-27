import { connect } from 'react-redux';
import { getAllBlogPosts } from '../../state/actions/blog';
import Blog from './component';

const mapStateToProps = (state) => {
  const {
    blog: {
      blogPosts,
    },
  } = state;

  return { blogPosts };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllBlogPosts: () => dispatch(getAllBlogPosts()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
