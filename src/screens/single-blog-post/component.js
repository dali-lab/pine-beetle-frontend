import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants';
import {
  createBlogPostComment,
  getBlogPostComments,
  getBlogPostLikes,
  toggleBlogPostLike,
} from '../../services/blog';
import { getDateToDisplay } from '../../utils';

import './style.scss';

const SingleBlogPost = (props) => {
  const {
    blogPosts,
    getAllBlogPosts,
  } = props;

  const { id } = useParams();

  const [likes, setLikes] = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [authorError, setAuthorError] = useState('');
  const [contentError, setContentError] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    getAllBlogPosts();
  }, [getAllBlogPosts]);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!id) return;
      try {
        const [likesData, commentsData] = await Promise.all([
          getBlogPostLikes(id),
          getBlogPostComments(id),
        ]);
        setLikes(likesData.count);
        setUserHasLiked(likesData.userHasLiked);
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } catch (error) {
        console.error('Failed to fetch blog post data:', error);
      }
    };
    fetchPostData();
  }, [id]);

  const history = useHistory();
  const post = blogPosts.find((blogPost) => blogPost._id === id);

  const handleLike = async () => {
    if (!id || isLiking) return;

    const prevLikes = likes;
    const prevHasLiked = userHasLiked;

    setUserHasLiked(!userHasLiked);
    setLikes(userHasLiked ? likes - 1 : likes + 1);
    setIsLiking(true);

    try {
      const result = await toggleBlogPostLike(id);
      setLikes(result.count);
      setUserHasLiked(result.liked);
    } catch (error) {
      setLikes(prevLikes);
      setUserHasLiked(prevHasLiked);
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setAuthorError('');
    setContentError('');

    let hasError = false;
    if (!commentAuthor.trim()) {
      setAuthorError('Please enter your name');
      hasError = true;
    }
    if (!commentContent.trim()) {
      setContentError('Please enter a comment');
      hasError = true;
    }

    if (hasError || !id || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const newComment = await createBlogPostComment(id, commentContent, commentAuthor.trim());
      setComments([newComment, ...comments]);
      setCommentContent('');
      setCommentAuthor('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

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
              <div className="blog-post-actions">
                <button
                  type="button"
                  className={`like-button ${userHasLiked ? 'liked' : ''}`}
                  onClick={handleLike}
                  disabled={isLiking}
                >
                  <span className="like-number">{likes}</span>
                  <span className="like-label">{likes === 1 ? 'like' : 'likes'}</span>
                </button>
              </div>
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

          <div className="comments-section">
            <h2 className="comments-title">
              Comments ({comments.length})
            </h2>

            <div className="comments-list">
              {comments.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">
                        {comment.author || 'Anonymous'}
                      </span>
                      <span className="comment-date">
                        {getDateToDisplay(comment.date_created)}
                      </span>
                    </div>
                    <div className="comment-content">
                      {comment.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <h3 className="comment-form-title">Add a Comment</h3>
              <div className="form-group">
                <input
                  className={`form-input ${authorError ? 'error' : ''}`}
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => {
                    setCommentAuthor(e.target.value);
                    if (authorError) setAuthorError('');
                  }}
                  placeholder="Your name"
                  required
                />
                {authorError && <span className="error-message">{authorError}</span>}
              </div>
              <div className="form-group">
                <textarea
                  className={`form-textarea ${contentError ? 'error' : ''}`}
                  value={commentContent}
                  onChange={(e) => {
                    setCommentContent(e.target.value);
                    if (contentError) setContentError('');
                  }}
                  placeholder="Write your comment here..."
                  rows="4"
                  maxLength={1000}
                  required
                />
                {contentError && <span className="error-message">{contentError}</span>}
              </div>
              <button
                type="submit"
                className="submit-comment-button"
                disabled={isSubmittingComment}
              >
                {isSubmittingComment ? 'Submitting...' : 'Submit Comment'}
              </button>
            </form>
          </div>
        </article>
      </div>
    </div>
  );
};

export default SingleBlogPost;
