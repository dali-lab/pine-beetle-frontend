import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { ROUTES } from '../../../../constants';
import { getDateToDisplay, truncateText } from '../../../../utils';
// TODO: Re-enable likes/comments stats when backend endpoints are available
// import { getBlogPostLikes, getBlogPostComments } from '../../../../services/blog';

import './style.scss';

const BlogPost = ({ post }) => {
  const {
    title,
    body,
    date_created: createdAt,
    _id,
  } = post;

  // TODO: Re-enable likes/comments stats when backend endpoints are available
  // const [likes, setLikes] = useState(0);
  // const [comments, setComments] = useState(0);

  const history = useHistory();
  const location = useLocation();
  const isSinglePostPage = location.pathname.includes('/blog/') && location.pathname !== '/blog';

  // TODO: Re-enable likes/comments stats when backend endpoints are available
  // useEffect(() => {
  //   const fetchStats = async () => {
  //     if (!_id) return;
  //     try {
  //       const [likesData, commentsData] = await Promise.all([
  //         getBlogPostLikes(_id),
  //         getBlogPostComments(_id),
  //       ]);
  //       setLikes(likesData.count);
  //       setComments(commentsData.length);
  //     } catch (error) {
  //       console.error('Failed to fetch blog post stats:', error);
  //     }
  //   };
  //   fetchStats();
  // }, [_id]);

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
        {/* Likes/comments stats hidden until backend is ready */}
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
