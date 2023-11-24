import React, { useState } from 'react';

import { FileInput } from '../../../../components/input-components';

import './style.scss';

const BlogPostForm = (props) => {
  const {
    onSubmit, formTitle, formValues, formType, error,
  } = props;

  const [formData, setFormData] = useState(formValues || {
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
    if (formType === 'create') {
      await onSubmit(data, () => setFormData({
        title: '',
        body: '',
        image: null,
      }));
    } else {
      onSubmit(data);
    }
  };

  const uploadImageComponent = {
    file: formData.image,
    id: `${formType}-blog-post-image`,
    name: formType === 'edit'
      ? 'Change image for your blog post'
      : 'Upload image for your blog post',
    selectFile: handleFileChange,
  };

  const resetImage = () => setFormData({
    ...formData,
    image: null,
  });

  const isButtonDisabled = !formData.title.length || !formData.body.length;

  const shouldErrorDisplay = error?.action && error.action.toLowerCase().includes(formType);

  return (
    <div className="add-blog-post-container">
      <div className="blog-posts-form-title">
        {formTitle}
      </div>
      <form>
        <label htmlFor="title" className="input-label">
          Title
          <div className="input-container">
            <input
              name="title"
              type="text"
              placeholder="Title"
              onChange={handleInputChange}
              value={formData.title}
              required
            />
          </div>
        </label>
        <div className="image-input-container">
          <FileInput
            component={uploadImageComponent}
            onResetFiles={resetImage}
            fileFormat="image/png, image/jpg, image/jpeg, image/pjpeg"
          />
          {typeof formData.image === 'string' && (
          <div className="image-preview-container">
            <img src={`${global.API_URL}${formData.image}`} alt="blog post illustration" />
          </div>
          )}
        </div>
        <label htmlFor="body" className="input-label">
          Enter blog post
          <div className="input-container">
            <textarea
              name="body"
              onChange={handleInputChange}
              value={formData.body}
              required
            />
          </div>
        </label>
        <button
          type="submit"
          className={`blog-form-button ${isButtonDisabled ? '' : 'animated-button'}`}
          onClick={handleSubmit}
          disabled={isButtonDisabled}
        >
          Submit
        </button>
        <div className="blog-form-error">{shouldErrorDisplay && error.message}</div>
      </form>
    </div>
  );
};

export default BlogPostForm;
