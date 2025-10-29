import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { ROUTES } from '../../../../constants';
import { getDateToDisplay, truncateText } from '../../../../utils';
import { getBlogPostLikes, getBlogPostComments } from '../../../../services/blog';

import './style.scss';

const BlogPost = ({ post }) => {
  const {
    title,
    body,
    date_created: createdAt,
    _id,
  } = post;

  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);

  const history = useHistory();
  const location = useLocation();
  const isSinglePostPage = location.pathname.includes('/blog/') && location.pathname !== '/blog';

  useEffect(() => {
    const fetchStats = async () => {
      if (!_id) return;

      try {
        // Fetch likes and comments from API
        const [likesData, commentsData] = await Promise.all([
          getBlogPostLikes(_id),
          getBlogPostComments(_id),
        ]);
        setLikes(likesData.count);
        setComments(commentsData.length);
      } catch (error) {
        console.error('Failed to fetch blog post stats:', error);
        // Fallback to localStorage if API fails
        const savedLikes = localStorage.getItem(`blog-likes-${_id}`);
        const savedComments = localStorage.getItem(`blog-comments-${_id}`);

        if (savedLikes) {
          setLikes(parseInt(savedLikes, 10));
        }
        if (savedComments) {
          setComments(JSON.parse(savedComments).length);
        }
      }
    };

    fetchStats();
  }, [_id]);

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
          <span className="blog-post-likes">{likes} likes</span>
          <span className="blog-post-comments">{comments} comments</span>
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
