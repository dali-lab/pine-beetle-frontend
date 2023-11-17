import React from 'react';

import BlogPostForm from '../blog-post-form';
import './style.scss';

const AddBlogPost = (props) => {
  const { createBlogPost } = props;

  return (
    <BlogPostForm onSubmit={createBlogPost} />
  );
};

export default AddBlogPost;
