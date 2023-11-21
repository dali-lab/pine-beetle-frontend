import React from 'react';

import BlogPostForm from '../blog-post-form';
import './style.scss';

const AddBlogPost = (props) => {
  const { createBlogPost } = props;

  return (
    <BlogPostForm onSubmit={createBlogPost} formTitle="Create blog post" formType="create" />
  );
};

export default AddBlogPost;
