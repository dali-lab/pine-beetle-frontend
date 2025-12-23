import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { getDateToDisplay } from '../../utils';

import './style.scss';

const SingleBlogPost = (props) => {
  const {
    blogPosts,
    getAllBlogPosts,
  } = props;

  const { id } = useParams();

  useEffect(() => {
    getAllBlogPosts();
  }, [getAllBlogPosts]);

  const history = useHistory();
  const post = blogPosts.find((blogPost) => blogPost._id === id);

  if (!post) {
    return (
      <div className="single-blog-page-container">
        <div className="blog-content">
          <div>Loading post...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="single-blog-page-container">
      <div className="blog-content">
        <button
          className="back-button"
          type="button"
          onClick={() => history.push(ROUTES.BLOG)}
        >
          ← Back to the posts list
        </button>

        <article className="single-blog-post">
          <header className="blog-post-header">
            <div className="blog-post-meta">
              <time className="blog-post-date">
                {getDateToDisplay(post.date_created)}
              </time>
              {/* Likes hidden until backend is ready */}
            </div>
            <h1 className="blog-post-title">
              {post.title}
            </h1>
          </header>

          <div className="blog-post-content">
            <div className="blog-post-body">
              {post.body}
            </div>
          </div>

          {/* Comments hidden until backend is ready */}
        </article>
      </div>
    </div>
  );
};

export default SingleBlogPost;
