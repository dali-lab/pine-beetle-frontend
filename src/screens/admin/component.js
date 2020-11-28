import React from 'react';

import {
  AddUser,
  FileUpload,
  Login,
  Users,
} from './components';

import './style.scss';

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

  if (!isLoggedIn) {
    return <Login />;
  } else {
    return (
      <div id="auth-container">
        <h1>Admin Dashboard</h1>
        <div id="auth-header">
          <p>Hi, {lastName ? `${firstName} ${lastName}` : firstName}!</p>
          <div id="header-options">
            <p id="sign-out" onClick={signOut}>Sign Out</p>
            {/* TODO: change password function */}
            <p id="change-password">Change Password</p>
          </div>
        </div>
        <div id="dashboard-container">
          <div id="dashboard">
            <div id="upload-container"><FileUpload /></div>
            <div id="user-container">
              <div id="users-container"><Users /></div>
              <div id="add-users"><AddUser /></div>
            </div>
          </div>
          <button
            type="button"
            className="animated-button"
            id="rerun-button"
          >
            Rerun all models
          </button>
        </div>
      </div>
    );
  }
};

export default Admin;
