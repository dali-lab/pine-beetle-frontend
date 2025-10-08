import React, { useEffect } from 'react';

import { sortBlogPosts } from '../../utils';
import BlogPost from './components';

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
      {/* Hero Section */}
      <div className="blog-hero-section">
        <h1 className="blog-hero-title">Blog</h1>
      </div>

      <div className="blog-content">
        <div className="blog-header">
          <h2 className="blog-section-title">Latest posts</h2>
        </div>
        <div className="blog-posts-list">
          {sortedBlogPosts.length > 0
            ? sortedBlogPosts.map((post) => <BlogPost key={post._id} post={post} />)
            : <div className="blog-page-no-posts">There are no blog posts yet</div>}
        </div>
      </div>
    </div>
  );
};

export default Blog;
