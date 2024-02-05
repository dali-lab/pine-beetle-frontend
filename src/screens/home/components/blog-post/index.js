import { connect } from 'react-redux';
import BlogPost from './component';

const mapStateToProps = (state) => {
  const {
    blog: {
      blogPosts,
    },
  } = state;

  return { blogPosts };
};

const mapDispatchToProps = (_dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(BlogPost);
