import React, { useState } from 'react';

import {
  AddBlogPost,
  BlogPosts,
  ChangePassword,
  FileUpload,
  Login,
  UploadHistory,
  UserSection,
} from './components';

import { runPipeline, updateHistogram } from '../../services/admin';

import './style.scss';

const guideURL = 'https://docs.google.com/document/u/1/d/e/2PACX-1vS-VkOBKcB3_nAsyIYUU-ogG-zezQd-XZmDt5SFqMPd6OkrpRXGtoa1_Fr0gDL6LBIwzQI9A6Ix3JKr/pub';

const Admin = (props) => {
  const {
    isLoggedIn,
    signOut,
    user,
  } = props;

  const {
    first_name: firstName,
    last_name: lastName,
  } = user;

  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [runningModels, setRunningModels] = useState(false);
  const [updatingHistogram, setUpdatingHistogram] = useState(false);
  const [modelError, setModelError] = useState('');
  const [histogramError, setHistogramError] = useState('');

  const runAllModels = async () => {
    setModelError('');
    setRunningModels(true);

    try {
      await runPipeline();
    } catch (err) {
      setModelError(err?.response?.data?.error?.message || '');
    } finally {
      setRunningModels(false);
    }
  };

  const runUpdateHistogram = async () => {
    setHistogramError('');
    setUpdatingHistogram(true);

    try {
      await updateHistogram();
    } catch (err) {
      setHistogramError(err?.response?.data || '');
    } finally {
      setUpdatingHistogram(false);
    }
  };

  if (!isLoggedIn) {
    return <Login />;
  } else {
    return (
      <div id="auth-container">
        <h1>Admin Dashboard</h1>
        <div id="auth-header">
          <p>Hi, {lastName ? `${firstName} ${lastName}` : firstName}!</p>
          <p>Before uploading any data, please read <a href={guideURL} target="_blank" rel="noopener noreferrer">this guide</a>.</p>
          <div id="header-options">
            <p id="sign-out" onClick={signOut}>Sign Out</p>
            <p id="change-password" onClick={() => setChangePasswordVisible(true)}>Change Password</p>
          </div>
        </div>
        <div id="dashboard-container">
          <div id="dashboard">
            <div id="upload-container"><FileUpload guideURL={guideURL} /></div>
            <UserSection />
          </div>
          <div className="dashboard-buttons-container">
            <div className="button">
              <button
                className="animated-button"
                disabled={runningModels}
                id="rerun-button"
                onClick={runAllModels}
                type="button"
              >
                {runningModels ? 'Running...' : 'Rerun all models'}
              </button>
              {modelError && (
              <div id="model-error-container">
                <p>{modelError}</p>
              </div>
              )}
            </div>
            <div className="button">
              <button
                className="animated-button"
                disabled={updatingHistogram}
                id="update-histogram-button"
                onClick={runUpdateHistogram}
                type="button"
              >
                {updatingHistogram ? 'Updating...' : 'Update histogram'}
              </button>
              {histogramError && (
              <div id="histogram-error-container">
                <span className="error-mark">!</span>
                <p>{histogramError}</p>
              </div>
              )}
            </div>
          </div>
          <div className="upload-history-section">
            <UploadHistory />
          </div>
          <div className="blog-container">
            <AddBlogPost />
            <BlogPosts />
          </div>
        </div>
        <ChangePassword
          close={() => setChangePasswordVisible(false)}
          open={() => setChangePasswordVisible(true)}
          visible={changePasswordVisible}
        />
      </div>
    );
  }
};

export default Admin;
