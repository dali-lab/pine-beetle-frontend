import React, { useState } from 'react';

import { admin as adminService } from '../../../../services';

import './style.scss';

const AddUser = ({ setUsers }) => {
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
      const newUser = await adminService.addAdminUser(email, password, firstName, lastName);

      if (newUser) {
        setUsers((prevUsers) => [...prevUsers, {
          id: newUser._id,
          email: newUser.email,
          name: `${newUser.first_name} ${newUser.last_name}`,
        }]);
        setSuccess(true);

        // Clear all input fields
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
        setError();

        // clear the success message
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
      return newUser;
    } catch (err) {
      return setError(err?.response?.data?.error?.message || '');
    }
  };

  return (
    <>
      <h3 id="sign-up-title">Add a new user</h3>
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
