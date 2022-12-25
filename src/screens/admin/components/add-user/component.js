import React, { useState } from 'react';

import { admin as adminService } from '../../../../services';

import './style.scss';

const AddUser = (_props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);

  const clearError = () => setError();

  const fieldSetter = (setter) => (e) => {
    setter(e.target.value);
    clearError();
    setSuccess(false);
  };

  const onSignUpPress = async () => {
    if (!email) return setError('Please enter an email');
    if (!password) return setError('Please enter a password');
    if (!confirmPassword) return setError('Please enter your password again in the confirm password field');
    if (!firstName) return setError('Please enter a first name');

    const passwordsMatch = password === confirmPassword;

    if (!passwordsMatch) {
      return setError('Passwords must match');
    }

    try {
      return await adminService.addAdminUser(email, password, firstName, lastName);
    } catch (err) {
      return setError(err?.response?.data?.error?.message || '');
    }
  };

  return (
    <>
      <p id="sign-up-title">Add a new user</p>
      <div id="input-fields">
        {success && (
          <p id="success-message">Successfully added user</p>
        )}
        <div id="input-names">
          <div className="input-container">
            <input
              value={firstName}
              onChange={fieldSetter(setFirstName)}
              placeholder="First Name"
            />
          </div>
          <div className="input-container">
            <input
              value={lastName}
              onChange={fieldSetter(setLastName)}
              placeholder="Last Name"
            />
          </div>
        </div>
        <div className="input-container">
          <input
            value={email}
            onChange={fieldSetter(setEmail)}
            placeholder="Email"
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            value={password}
            onChange={fieldSetter(setPassword)}
            placeholder="Password"
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            value={confirmPassword}
            onChange={fieldSetter(setConfirmPassword)}
            placeholder="Confirm Password"
          />
        </div>
      </div>
      {error && (
        <div id="error-container">
          <p>{error}</p>
        </div>
      )}
      <button
        type="button"
        id="add-user-button"
        className="animated-button"
        onClick={onSignUpPress}
      >Add
      </button>
    </>
  );
};

export default AddUser;
