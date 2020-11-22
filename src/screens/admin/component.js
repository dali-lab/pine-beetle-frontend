import React, { useState } from 'react';

import {
  AddUser,
  Login,
} from './components';

import './style.scss';

const componentsToRender = [{
  name: 'Add User',
  component: AddUser,
}, {
  name: 'Some Other Option',
  component: () => {},
}];

const Admin = (props) => {
  const {
    isLoggedIn,
    signOut,
    user,
  } = props;

  const {
    first_name: firstName,
  } = user;

  const [currentComponent, setCurrentComponent] = useState({});

  if (!isLoggedIn) {
    return <Login />;
  } else {
    return (
      <div id="auth-container">
        <h1>Pine Beetle Admin Portal</h1>
        <div id="auth-header">
          <p>Welcome {firstName}!</p>
          <p id="sign-out" onClick={signOut}>Sign Out</p>
        </div>
        <div id="selection-container">
          {componentsToRender.map(component => (
            <h3
              id={currentComponent.name === component.name ? 'selected-option' : ''}
              className="component-option"
              onClick={() => setCurrentComponent(component)}
            >
              {component.name}
            </h3>
          ))}
        </div>
        {currentComponent?.component && (
          <div id="component-container">
            <currentComponent.component />
          </div>
        )}
      </div>
    );
  }
};

export default Admin;
