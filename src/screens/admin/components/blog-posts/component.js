import React, { useEffect, useState } from 'react';
import { deleteBlogPost, editBlogPost, getAllBlogPostsByAuthor } from '../../../../services/blog';

import './style.scss';

const BlogPost = ({ post }) => {
  const date = new Date(post.date_created);
  const dateToDisplay = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;

  const onClickEdit = () => {
    editBlogPost(
      post.id,
      { title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ulla.' },
    );
  };

  const onClickDelete = () => {
    deleteBlogPost(post.id);
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

const BlogPosts = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const blogPostsArray = await getAllBlogPostsByAuthor();
      setBlogPosts(blogPostsArray);
    })();
  }, [setBlogPosts]);

  console.log(blogPosts);
  return (
    <div className="blog-posts-container">
      <div className="blog-posts-title">Your blog posts</div>
      {blogPosts.map((post) => <BlogPost post={post} key={post.id} />)}
    </div>
  );
};

export default BlogPosts;
