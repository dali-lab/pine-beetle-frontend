import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants';
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

  useEffect(() => {
    getAllBlogPosts();
    // Load likes and comments from localStorage (in a real app, this would be from API)
    const postId = window.location.pathname.split('/').pop();
    const savedLikes = localStorage.getItem(`blog-likes-${postId}`);
    const savedComments = localStorage.getItem(`blog-comments-${postId}`);

    if (savedLikes) {
      setLikes(parseInt(savedLikes, 10));
    }
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [getAllBlogPosts]);

  const history = useHistory();
  const { id } = useParams();
  const post = blogPosts.find((blogPost) => blogPost._id === id);

  const handleLike = () => {
    const newLikes = isLiked ? likes - 1 : likes + 1;
    setLikes(newLikes);
    setIsLiked(!isLiked);
    localStorage.setItem(`blog-likes-${id}`, newLikes.toString());
    localStorage.setItem(`blog-liked-${id}`, (!isLiked).toString());
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() && commentName.trim()) {
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
    }
  };

  if (!post) {
    return (
      <div className="single-blog-page-container">
        <div className="blog-content">
          <div className="loading-message">Loading post...</div>
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
            <h3 className="comments-title">Comments ({comments.length})</h3>

            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">{comment.name}</span>
                    <time className="comment-date">
                      {getDateToDisplay(comment.date)}
                    </time>
                  </div>
                  <div className="comment-content">
                    {comment.comment}
                  </div>
                </div>
              ))}
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
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Your email (optional)"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  className="form-input"
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
                />
              </div>
              <button type="submit" className="submit-comment-button">
                Post Comment
              </button>
            </form>
          </section>
        </article>
      </div>
    </div>
  );
};

export default SingleBlogPost;
