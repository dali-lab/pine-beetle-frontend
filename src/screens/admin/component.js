import React, { useState } from 'react';

import {
  AddBlogPost,
  AddUser,
  BlogPosts,
  ChangePassword,
  FileUpload,
  Login,
  Users,
} from './components';

import { runPipeline } from '../../services/admin';

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
  const [modelError, setModelError] = useState('');

  const runAllModels = async () => {
    setRunningModels(true);

    try {
      await runPipeline();
    } catch (err) {
      setModelError(err?.response?.data?.error?.message || '');
    } finally {
      setRunningModels(false);
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
            <div id="user-container">
              <div id="users-container"><Users /></div>
              <div id="add-users"><AddUser /></div>
            </div>
          </div>
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
