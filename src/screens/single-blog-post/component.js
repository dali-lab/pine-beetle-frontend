import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants';
// TODO: Re-enable likes/comments when backend endpoints are available
// import {
//   createBlogPostComment,
//   getBlogPostComments,
//   getBlogPostLikes,
//   toggleBlogPostLike,
// } from '../../services/blog';
import { getDateToDisplay } from '../../utils';

import './style.scss';

const SingleBlogPost = (props) => {
  const {
    blogPosts,
    getAllBlogPosts,
  } = props;

  // TODO: Re-enable likes/comments when backend endpoints are available
  // const [likes, setLikes] = useState(0);
  // const [isLiked, setIsLiked] = useState(false);
  // const [comments, setComments] = useState([]);
  // const [commentContent, setCommentContent] = useState('');
  // const [isLoadingComments, setIsLoadingComments] = useState(true);
  // const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    getAllBlogPosts();
  }, [getAllBlogPosts]);

  // TODO: Re-enable likes/comments when backend endpoints are available
  // useEffect(() => {
  //   const fetchLikes = async () => {
  //     if (!id) return;
  //     try {
  //       const likesData = await getBlogPostLikes(id);
  //       setLikes(likesData.count);
  //       setIsLiked(likesData.userHasLiked);
  //     } catch (error) {
  //       console.error('Failed to fetch likes:', error);
  //     }
  //   };
  //
  //   fetchLikes();
  // }, [id]);

  // useEffect(() => {
  //   const fetchComments = async () => {
  //     if (!id) return;
  //     setIsLoadingComments(true);
  //     try {
  //       const commentsData = await getBlogPostComments(id);
  //       setComments(commentsData);
  //     } catch (error) {
  //       console.error('Failed to fetch comments:', error);
  //     } finally {
  //       setIsLoadingComments(false);
  //     }
  //   };
  //
  //   fetchComments();
  // }, [id]);

  const history = useHistory();
  const post = blogPosts.find((blogPost) => blogPost._id === id);

  // TODO: Re-enable likes/comments when backend endpoints are available
  // const handleLike = async () => { ... };
  // const handleCommentSubmit = async (e) => { ... };

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
