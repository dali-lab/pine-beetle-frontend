import React, { useState } from 'react';

import './style.scss';

const Login = (props) => {
  const {
    login,
  } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();

  const clearError = () => setError();

  const fieldSetter = setter => (e) => {
    setter(e.target.value);
    clearError();
  };

  const onLoginPress = () => {
    if (!email && !password) return setError('Please enter an email and password');
    if (!email) return setError('Please enter an email');
    if (!password) return setError('Please enter a password');

    return login(email, password, undefined, (err) => {
      console.log(err.response);
      setError(err?.response?.data?.error?.message || '');
    });
  };

  return (
    <div id="login-container">
      <h1>Admin Login</h1>
      <div id="input-button-container">
        <div id="input-fields">
          <div className="input-container">
            <p>Email</p>
            <input
              value={email}
              onChange={fieldSetter(setEmail)}
              id={error && !email && 'error-input'}
            />
          </div>
          <div className="input-container">
            <p>Password</p>
            <input
              type="password"
              value={password}
              onChange={fieldSetter(setPassword)}
              id={error && !password && 'error-input'}
            />
          </div>
        </div>
        <div id="forgot-password">
          <p>Forgot Password?</p>
        </div>
        {error && (
          <div id="error-container">
            <p>{error}</p>
          </div>
        )}
        <button
          type="button"
          onClick={onLoginPress}
          className="animated-button"
        >Login
        </button>
      </div>
    </div>
  );
};

export default Login;
