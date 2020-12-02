import React, { useState } from 'react';

import { sendForgotPasswordEmail } from '../../../../services/admin';

import './style.scss';

const Login = (props) => {
  const {
    login,
  } = props;

  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();
  const [successMessage, setSuccessMessage] = useState('');

  const incorrectCredentials = error === 'Incorrect credentials';

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

  const onPasswordResetPress = async () => {
    if (!email) return setError('Please enter an email');

    try {
      await sendForgotPasswordEmail(email);
      setSuccessMessage('We sent a one-time password to your email. Enter it here to login.');
      return setForgotPasswordMode(false);
    } catch (err) {
      return setError(err?.response?.data?.error?.message || 'We encountered an error. Please try again.');
    }
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
              id={error && (!email || incorrectCredentials) && 'error-input'}
            />
          </div>
          {!forgotPasswordMode && (
            <div className="input-container">
              <p>Password</p>
              <input
                type="password"
                value={password}
                onChange={fieldSetter(setPassword)}
                id={error && (!password || incorrectCredentials) && 'error-input'}
              />
            </div>
          )}
        </div>
        {forgotPasswordMode ? (
          <>
            <button
              aria-label="forgot password button"
              id="forgot-password"
              onClick={() => setForgotPasswordMode(false)}
              type="button"
            >
              Back to Login
            </button>
            {(error || successMessage) && (
            <div id="error-success-container">
              <p id={error ? 'error' : 'success'}>{error || successMessage}</p>
            </div>
            )}
            <button
              className="animated-button"
              id="reset-password-button"
              onClick={onPasswordResetPress}
              type="button"
            >Reset Password
            </button>
          </>
        ) : (
          <>
            <button
              aria-label="forgot password button"
              id="forgot-password"
              onClick={() => setForgotPasswordMode(true)}
              type="button"
            >
              Forgot Password?
            </button>
            {(error || successMessage) && (
            <div id="error-success-container">
              <p id={error ? 'error' : 'success'}>{error || successMessage}</p>
            </div>
            )}
            <button
              className="animated-button"
              id="login-button"
              onClick={onLoginPress}
              type="button"
            >Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
