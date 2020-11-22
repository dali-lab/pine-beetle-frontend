import React, { useState } from 'react';

import './style.scss';

const AddUser = (props) => {
  const {
    addUser,
  } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);

  const clearError = () => setError();

  const fieldSetter = setter => (e) => {
    setter(e.target.value);
    clearError();
    setSuccess(false);
  };

  const onSignUpPress = () => {
    if (!email) return setError('Please enter an email');
    if (!password) return setError('Please enter a password');
    if (!confirmPassword) return setError('Please enter your password again in the confirm password field');
    if (!firstName) return setError('Please enter a first name');

    const passwordsMatch = password === confirmPassword;

    if (!passwordsMatch) {
      return setError('Passwords must match');
    }

    return addUser(email, password, firstName, lastName, () => {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');
      setError();
      setSuccess(true);
    }, (err) => {
      setError(err?.response?.data?.error?.message || '');
    });
  };

  return (
    <div id="sign-up-container">
      <div id="input-fields">
        {success && (
          <p id="success-message">Successfully added user</p>
        )}
        <div className="input-container">
          <p>Email: </p>
          <input
            value={email}
            onChange={fieldSetter(setEmail)}
          />
        </div>
        <div className="input-container">
          <p>First Name</p>
          <input
            value={firstName}
            onChange={fieldSetter(setFirstName)}
          />
        </div>
        <div className="input-container">
          <p>Last Name</p>
          <input
            value={lastName}
            onChange={fieldSetter(setLastName)}
          />
        </div>
        <div className="input-container">
          <p>Password</p>
          <input
            type="password"
            value={password}
            onChange={fieldSetter(setPassword)}
          />
        </div>
        <div className="input-container">
          <p>Confirm Password</p>
          <input
            type="password"
            value={confirmPassword}
            onChange={fieldSetter(setConfirmPassword)}
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
        onClick={onSignUpPress}
      >Add User
      </button>
    </div>
  );
};

export default AddUser;
