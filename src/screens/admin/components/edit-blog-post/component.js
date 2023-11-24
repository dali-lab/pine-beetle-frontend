import React from 'react';

import Modal from 'react-modal';
import BlogPostForm from '../blog-post-form';

import './style.scss';

const EditBlogPost = (props) => {
  const {
    isOpen, setIsOpen, post, onSubmit,
  } = props;
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  return (
    <Modal isOpen={isOpen}
      onAfterOpen={handleOpen}
      onRequestClose={handleClose}
      className="blog-post-edit-modal"
      ariaHideApp={false}
    >
      <BlogPostForm onSubmit={onSubmit}
        formTitle="Edit your blog post"
        formValues={{
          title: post.title,
          body: post.body,
          image: post.image,
        }}
        formType="edit"
      />
    </Modal>
  );
};

export default EditBlogPost;
