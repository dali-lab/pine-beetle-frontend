import React, { useState } from 'react';

import { FileInput } from '../../../../components/input-components';

import './style.scss';

const BlogPostForm = (props) => {
  const { onSubmit, formTitle } = props;

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    image: null,
  });

  const handleInputChange = (ev) => {
    return setFormData({
      ...formData,
      [ev.target.name]: ev.target.value,
    });
  };

  const handleFileChange = (file) => {
    setFormData({
      ...formData,
      image: file,
    });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('body', formData.body);

    if (formData.image) {
      data.append('image', formData.image);
    }

    await onSubmit(data);
  };

  const uploadImageComponent = {
    file: formData.image,
    id: 'blog-post-image',
    name: 'Upload image for your blog post',
    selectFile: handleFileChange,
  };

  const resetImage = () => setFormData({
    ...formData,
    image: null,
  });

  return (
    <div className="add-blog-post-container">
      <div className="blog-posts-form-title">
        {formTitle}
      </div>
      <form>
        <label htmlFor="title" className="input-label">
          Title
          <div className="input-container">
            <input name="title" type="text" placeholder="Title" onChange={handleInputChange} />
          </div>
        </label>
        <div className="image-input-container">
          <FileInput component={uploadImageComponent} onResetFiles={resetImage} fileFormat="image/png, image/jpg, image/jpeg, image/pjpeg" />
        </div>
        <label htmlFor="body" className="input-label">
          Enter blog post
          <div className="input-container">
            <textarea name="body" onChange={handleInputChange} />
          </div>
        </label>
        <button type="submit" className="blog-form-button animated-button" onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
};

export default BlogPostForm;
