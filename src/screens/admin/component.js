import React from 'react';

import {
  AddUser,
  FileUpload,
  Login,
  Users,
} from './components';

import './style.scss';

// const componentsToRender = [{
//   name: 'Upload File for County Spot Data',
//   component: () => {},
// }, {
//   name: 'Upload File for Ranger District Spot Data',
//   component: () => {},
// }, {
//   name: 'Upload File for Survey123 Unsummarized Data',
//   component: () => {},
// }, {
//   name: 'Users',
//   component: () => {},
// }, {
//   name: 'Add User',
//   component: AddUser,
// }];

const Admin = (props) => {
  const {
    isLoggedIn,
    signOut,
    user,
  } = props;

  const {
    first_name: firstName,
  } = user;

  // const [currentComponent, setCurrentComponent] = useState({});

  if (!isLoggedIn) {
    return <Login />;
  } else {
    return (
      <div id="auth-container">
        <h1>Admin Dashboard</h1>
        <div id="auth-header">
          <p>Welcome {firstName}!</p>
          <div id="header-options">
            <p id="sign-out" onClick={signOut}>Sign Out</p>
            <div id="vl" />
            {/* TODO: change password function */}
            <p id="change-password">Change Password</p>
          </div>
        </div>
        <div id="dashboard-container">
          <div id="upload-container"><FileUpload /></div>
          <div id="user-container">
            <div><Users /></div>
            <div><AddUser /></div>
          </div>
        </div>
        {/* <div id="selection-container">
          {componentsToRender.map(component => (
            <h3
              id={currentComponent.name === component.name ? 'selected-option' : ''}
              className="component-option"
              onClick={() => setCurrentComponent(component)}
            >
              {component.name}
            </h3>
          ))}
        </div> */}
        {/* {currentComponent?.component && (
          <div id="component-container">
            <currentComponent.component />
          </div>
        )} */}
      </div>
    );
  }
};

export default Admin;
