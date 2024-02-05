import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import EditBlogPost from '../edit-blog-post';
import { getDateToDisplay, sortBlogPosts } from '../../../../utils';

import './style.scss';

const BlogPost = ({ post, onClickEdit, onDelete }) => {
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
          {getDateToDisplay(post.date_created)}
        </div>
      </div>
      <div className="blog-post-action-buttons">
        <button className="animated-button blog-post-button" type="button" onClick={onClickEdit}>Edit</button>
        <button className="animated-button blog-post-button" type="button" onClick={onClickDelete}>Delete</button>
      </div>
    </div>
  );
};

const DeleteModal = ({
  handleDelete, isOpen, setIsOpen, title,
}) => {
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  return (
    <Modal isOpen={isOpen}
      onAfterOpen={handleOpen}
      onRequestClose={handleClose}
      className="delete-blog-post-modal"
      ariaHideApp={false}
    >
      <div>
        Are you sure you want to delete <span className="delete-blog-post-title">{`"${title}" `}</span>?
        <div className="delete-blog-post-buttons">
          <button type="button" className="blog-post-button animated-button" onClick={handleDelete}>Yes</button>
          <button type="button" className="blog-post-button animated-button" onClick={handleClose}>No</button>
        </div>
      </div>
    </Modal>
  );
};

const BlogPosts = (props) => {
  const {
    blogPosts, getAllBlogPostsByAuthor, editBlogPost, deleteBlogPost,
  } = props;

  const [selectedBlogPost, setSelectedBlogPost] = useState({
    id: null, title: '', body: '', image: null,
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openEditForm = (post) => {
    setShowEditForm(true);
    setSelectedBlogPost(post);
  };

  const openDeleteModal = (post) => {
    setShowDeleteModal(true);
    setSelectedBlogPost(post);
  };

  useEffect(() => {
    getAllBlogPostsByAuthor();
  }, [getAllBlogPostsByAuthor]);

  // Sort posts from the newest to the oldest
  const sortedBlogPosts = sortBlogPosts(blogPosts);

  const handleFormSubmit = async (formData) => {
    const closeModal = () => { setShowEditForm(false); };
    await editBlogPost(selectedBlogPost.id, formData, closeModal);
  };

  const handleDeleteBlogPost = async () => {
    const closeModal = () => setShowDeleteModal(false);
    await deleteBlogPost(selectedBlogPost.id, closeModal);
  };

  return (
    <div className="blog-posts-container">
      <div className="blog-posts-title">Your blog posts</div>
      {sortedBlogPosts.length > 0
        ? sortedBlogPosts.map(
          (post) => <BlogPost post={post} onClickEdit={() => openEditForm(post)} onDelete={() => openDeleteModal(post)} key={post.id} />,
        ) : <div>You haven&#39;t written any blog posts yet!</div>}
      <EditBlogPost isOpen={showEditForm} setIsOpen={setShowEditForm} post={selectedBlogPost} onSubmit={handleFormSubmit} />
      <DeleteModal handleDelete={handleDeleteBlogPost} isOpen={showDeleteModal} setIsOpen={setShowDeleteModal} title={selectedBlogPost.title} />

    </div>
  );
};

export default BlogPosts;
