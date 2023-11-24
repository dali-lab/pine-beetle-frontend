import { connect } from 'react-redux';

import BlogPostForm from './component';

const mapStateToProps = (state) => {
  const {
    blog: {
      error,
    },
  } = state;

  return { error };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(BlogPostForm);
