import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { ROUTES } from '../../../../constants';
import { getDateToDisplay, truncateText } from '../../../../utils';

import './style.scss';

const BlogPost = ({ post }) => {
  const {
    title,
    body,
    date_created: createdAt,
    likesCount = 0,
    commentsCount = 0,
    _id,
  } = post;

  const history = useHistory();
  const location = useLocation();
  const isSinglePostPage = location.pathname.includes('/blog/') && location.pathname !== '/blog';

  const handleClick = () => {
    if (!isSinglePostPage) {
      history.push(`${ROUTES.BLOG}/${_id}`);
    }
  };

  return (
    <article className="blog-post-item">
      <div className="blog-post-meta">
        <div className="blog-post-date">
          {getDateToDisplay(createdAt)}
        </div>
        <div className="blog-post-stats">
          <span className="blog-post-likes">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
          <span className="blog-post-comments">{commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}</span>
        </div>
      </div>
      <h2 className={`blog-post-title ${isSinglePostPage ? 'no-click' : ''}`} onClick={handleClick}>
        {title}
      </h2>
      <div className={isSinglePostPage ? 'blog-post-content' : 'blog-post-snippet-container'}>
        {isSinglePostPage ? (
          <div className="blog-post-full-body">
            {body}
          </div>
        ) : (
          <div className="blog-post-snippet">
            {truncateText(body, 200)}
            <span className="continue-reading" onClick={handleClick}>
              continue reading
            </span>
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogPost;
