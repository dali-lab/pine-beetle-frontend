import React from 'react';

import { formatPostDates } from '../../../../utils';

import './style.scss';

const BlogPost = ({ post }) => {
  const {
    title,
    body,
    date_created: createdAt,
    date_edited: editedAt,
    image,
    author,
  } = post;

  return (
    <div className="blog-page-blog-post-container page-container">
      <div className="blog-page-blog-post-title">{title}</div>
      <div className="blog-page-blog-post-author">{`by ${author}`}</div>
      {image && <img className="blog-page-blog-post-picture" src={`${global.API_URL}${image}`} alt="blog post illustration" />}
      <div className="blog-page-blog-post-body">{body}</div>
      <div className="blog-page-blog-post-date">{formatPostDates(createdAt, editedAt)}</div>
    </div>
  );
};

export default BlogPost;
