import React, { useEffect } from 'react';

import './style.scss';

const BlogPost = ({ post, onEdit, onDelete }) => {
  const date = new Date(post.date_created);
  const dateToDisplay = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;

  const onClickEdit = () => {
    onEdit(
      post.id,
      { title: 'New title 40' },
    );
  };

  const onClickDelete = () => {
    onDelete(post.id);
  };

  return (
    <div className="blog-post">
      <div>
        <div className="blog-post-title">
          {post.title}
        </div>
        <div className="blog-post-date">
          {dateToDisplay}
        </div>
      </div>
      <div className="blog-post-action-buttons">
        <button className="animated-button blog-post-button" type="button" onClick={onClickEdit}>Edit</button>
        <button className="animated-button blog-post-button" type="button" onClick={onClickDelete}>Delete</button>
      </div>
    </div>
  );
};

const BlogPosts = (props) => {
  const {
    blogPosts, getAllBlogPostsByAuthor, editBlogPost, deleteBlogPost,
  } = props;

  useEffect(() => {
    getAllBlogPostsByAuthor();
  }, [getAllBlogPostsByAuthor]);

  // Sort posts from the newest to the oldest
  const sortedBlogPosts = blogPosts.sort((a, b) => {
    const dateA = new Date(a.date_created);
    const dateB = new Date(b.date_created);

    return dateB - dateA;
  });

  return (
    <div className="blog-posts-container">
      <div className="blog-posts-title">Your blog posts</div>
      {sortedBlogPosts.length > 0
      && sortedBlogPosts.map(
        (post) => <BlogPost post={post} onEdit={editBlogPost} onDelete={deleteBlogPost} key={post.id} />,
      )}
    </div>
  );
};

export default BlogPosts;
