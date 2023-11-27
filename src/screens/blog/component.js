import React, { useEffect } from 'react';

import BlogPost from './components';
import { sortBlogPosts } from '../../utils';

import './style.scss';

const Blog = (props) => {
  const {
    blogPosts,
    getAllBlogPosts,
  } = props;

  useEffect(() => {
    getAllBlogPosts();
  }, [getAllBlogPosts]);

  const sortedBlogPosts = sortBlogPosts(blogPosts);

  return (
    <div className="blog-page-container">
      <div id="overview-text">
        <h1 id="title">Blog</h1>
      </div>
      {sortedBlogPosts.length > 0
        ? sortedBlogPosts.map((post) => <BlogPost post={post} />)
        : <div className="blog-page-no-posts">There are no blog posts yet</div>}
    </div>
  );
};

export default Blog;
