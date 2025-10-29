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

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    getAllBlogPosts();
  }, [getAllBlogPosts]);

  // Fetch likes when component mounts or id changes
  useEffect(() => {
    const fetchLikes = async () => {
      if (!id) return;

      try {
        const likesData = await getBlogPostLikes(id);
        setLikes(likesData.count);
        setIsLiked(likesData.userHasLiked);
      } catch (error) {
        console.error('Failed to fetch likes:', error);
        // Fallback to localStorage if API fails
        const savedLikes = localStorage.getItem(`blog-likes-${id}`);
        const savedIsLiked = localStorage.getItem(`blog-liked-${id}`);
        if (savedLikes) setLikes(parseInt(savedLikes, 10));
        if (savedIsLiked) setIsLiked(savedIsLiked === 'true');
      }
    };

    fetchLikes();
  }, [id]);

  // Fetch comments when component mounts or id changes
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;

      setIsLoadingComments(true);
      try {
        const commentsData = await getBlogPostComments(id);
        setComments(commentsData);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        // Fallback to localStorage if API fails
        const savedComments = localStorage.getItem(`blog-comments-${id}`);
        if (savedComments) setComments(JSON.parse(savedComments));
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchComments();
  }, [id]);

  const history = useHistory();
  const post = blogPosts.find((blogPost) => blogPost._id === id);

  const handleLike = async () => {
    if (!id) return;

    // Optimistic update
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : likes - 1;
    setIsLiked(newIsLiked);
    setLikes(newLikes);

    try {
      const result = await toggleBlogPostLike(id);
      // Update with actual values from server
      setLikes(result.count);
      setIsLiked(result.userHasLiked);
      // Also update localStorage as backup
      localStorage.setItem(`blog-likes-${id}`, result.count.toString());
      localStorage.setItem(`blog-liked-${id}`, result.userHasLiked.toString());
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert optimistic update on failure
      setIsLiked(!newIsLiked);
      setLikes(likes);
      // Fallback to localStorage
      localStorage.setItem(`blog-likes-${id}`, newLikes.toString());
      localStorage.setItem(`blog-liked-${id}`, newIsLiked.toString());
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !commentName.trim() || !id) return;

    setIsSubmittingComment(true);
    const commentData = {
      name: commentName,
      email: commentEmail,
      comment: newComment,
    };

    try {
      const createdComment = await createBlogPostComment(id, commentData);
      // Add the new comment to the list
      setComments([...comments, createdComment]);
      // Clear form
      setNewComment('');
      setCommentName('');
      setCommentEmail('');
      // Update localStorage as backup
      const updatedComments = [...comments, createdComment];
      localStorage.setItem(`blog-comments-${id}`, JSON.stringify(updatedComments));
    } catch (error) {
      console.error('Failed to submit comment:', error);
      // Fallback to localStorage
      const comment = {
        id: Date.now(),
        name: commentName,
        email: commentEmail,
        comment: newComment,
        date: new Date().toISOString(),
      };
      const updatedComments = [...comments, comment];
      setComments(updatedComments);
      localStorage.setItem(`blog-comments-${id}`, JSON.stringify(updatedComments));
      setNewComment('');
      setCommentName('');
      setCommentEmail('');
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
                  className={`like-button ${isLiked ? 'liked' : ''}`}
                  onClick={handleLike}
                  type="button"
                >
                  <span className="like-text">{isLiked ? 'Liked' : 'Like'}</span>
                  <span className="like-count">{likes}</span>
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

          <section className="comments-section">
            <h3 className="comments-title">
              Comments ({isLoadingComments ? '...' : comments.length})
            </h3>

            <div className="comments-list">
              {isLoadingComments && (
                <div className="comments-loading">Loading comments...</div>
              )}
              {!isLoadingComments && comments.length === 0 && (
                <div className="comments-empty">No comments yet. Be the first to comment!</div>
              )}
              {!isLoadingComments && comments.length > 0 && (
                comments.map((comment) => (
                  <div key={comment.id || comment._id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{comment.name}</span>
                      <time className="comment-date">
                        {getDateToDisplay(comment.date || comment.date_created)}
                      </time>
                    </div>
                    <div className="comment-content">
                      {comment.comment}
                    </div>
                  </div>
                ))
              )}
            </div>

            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <h4 className="comment-form-title">Leave a Comment</h4>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your name *"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  required
                  className="form-input"
                  disabled={isSubmittingComment}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Your email (optional)"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  className="form-input"
                  disabled={isSubmittingComment}
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Write your comment here... *"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  rows="4"
                  className="form-textarea"
                  disabled={isSubmittingComment}
                />
              </div>
              <button
                type="submit"
                className="submit-comment-button"
                disabled={isSubmittingComment}
              >
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          </section>
        </article>
      </div>
    </div>
  );
};

export default SingleBlogPost;
