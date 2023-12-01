import React from 'react';
import { useHistory } from 'react-router-dom';
import { getDateToDisplay, getLatestBlogPost, truncateText } from '../../../../utils';
import { Button } from '../../../../components';
import { ROUTES } from '../../../../constants';

import './style.scss';

const BlogPost = (props) => {
  const { blogPosts } = props;
  const latestPost = getLatestBlogPost(blogPosts);
  const history = useHistory();

  return (
    <div className="page-container">
      {latestPost ? (
        <>
          <div className="home-page-blog-post-title">
            {latestPost.title}
          </div>
          <div className="home-page-blog-post-info">
            <span className="home-page-blog-post-author">{`${latestPost.author}, `}</span>
            <span className="home-page-blog-post-author">{getDateToDisplay(latestPost.date_created)}</span>
          </div>
          <div className="home-page-blog-post-body">
            {truncateText(latestPost.body, 850)}
          </div>
          <div className="home-page-blog-post-buttons">
            <Button onClick={() => history.push(ROUTES.BLOG)} buttonStyle="primary">
              Read more
            </Button>
            <Button onClick={() => history.push(ROUTES.BLOG)} buttonStyle="secondary">See all blog posts</Button>
          </div>
        </>
      )
        : (
          <div className="home-page-blog-post-title">
            No blog posts yet
          </div>
        )}
    </div>
  );
};

export default BlogPost;
