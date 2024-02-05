import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { formatPostDates } from '../../../../utils';
import { ROUTES } from '../../../../constants';

import './style.scss';

const BlogPost = ({ post }) => {
  const {
    title,
    body,
    date_created: createdAt,
    date_edited: editedAt,
    image,
    author,
    _id,
  } = post;

  const history = useHistory();
  const location = useLocation();
  const isBlogPage = location.pathname === '/blog';

  return (
    <div className="blog-page-blog-post-container page-container">
      {isBlogPage
        ? <button className="blog-page-blog-post-title animated-button" type="button" onClick={() => history.push(`${ROUTES.BLOG}/${_id}`)}>{title}</button>
        : <div className="blog-page-blog-post-title">{title}</div>}
      <div className="blog-page-blog-post-author">{`by ${author}`}</div>
      {image && <img className="blog-page-blog-post-picture" src={image} alt="blog post illustration" />}
      <div className="blog-page-blog-post-body">{body}</div>
      <div className="blog-page-blog-post-date">{formatPostDates(createdAt, editedAt)}</div>
    </div>
  );
};

export default BlogPost;
