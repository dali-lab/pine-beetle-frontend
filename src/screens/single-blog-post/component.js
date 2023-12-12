import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import BlogPost from '../blog/components';
import { ROUTES } from '../../constants';

import './style.scss';

const SingleBlogPost = (props) => {
  const {
    blogPosts,
    getAllBlogPosts,
  } = props;

  useEffect(() => {
    getAllBlogPosts();
  }, [getAllBlogPosts]);

  const history = useHistory();

  const { id } = useParams();

  const post = blogPosts.find((blogPost) => blogPost._id === id);

  return (
    <div className="blog-page-container">
      <button className="back-button animated-button" type="button" onClick={() => history.push(ROUTES.BLOG)}> {'< Back to the posts list'}</button>
      {post && <BlogPost post={post} />}
    </div>
  );
};

export default SingleBlogPost;
