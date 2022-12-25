import React, { useState } from 'react';
import Modal from 'react-modal';

import { updatePassword } from '../../../../services/admin';

import './style.scss';

const ChangePassword = (props) => {
  const {
    close,
    email,
    open,
    visible,
  } = props;

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  const fieldSetter = (setter) => (e) => {
    setter(e.target.value);
    setSuccessText('');
    setErrorText('');
  };

  const changePassword = async () => {
    if (!currentPassword && !password && !confirmPassword) return setErrorText('Please enter and confirm your password');
    if (!currentPassword) return setErrorText('Please enter your current password');
    if (!password) return setErrorText('Please enter a new password');
    if (!confirmPassword) return setErrorText('Please confirm your new password');
    if (password !== confirmPassword) return setErrorText('Passwords do not match');

    try {
      await updatePassword(email, currentPassword, password);
      return setSuccessText('Successfully updated password');
    } catch (err) {
      return setErrorText(err?.response?.data?.error?.message || 'Failed to update password');
    }
  };

  return (
    <Modal
      isOpen={visible}
      onAfterOpen={open}
      onRequestClose={close}
      contentLabel="Change Password Modal"
      className="change-password-modal"
      ariaHideApp={false}
      closeTimeoutMS={150}
    >
      <div id="change-password-content-container">
        <div id="input-container-parent">
          <div className="input-container">
            <input
              type="password"
              value={currentPassword}
              onChange={fieldSetter(setCurrentPassword)}
              placeholder="Enter your current password"
              id={errorText && (!currentPassword) && 'error-input'}
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              value={password}
              onChange={fieldSetter(setPassword)}
              placeholder="Enter a new password"
              id={errorText && (!password || errorText === 'Passwords do not match') && 'error-input'}
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              value={confirmPassword}
              onChange={fieldSetter(setConfirmPassword)}
              placeholder="Confirm your new password"
              id={errorText && (!confirmPassword || errorText === 'Passwords do not match') && 'error-input'}
            />
          </div>
        </div>
        {(errorText || successText) && (
        <div id="error-success-container">
          <p id={errorText ? 'error' : 'success'}>{errorText || successText}</p>
        </div>
        )}
        <button
          type="button"
          onClick={changePassword}
        >Save
        </button>
      </div>
    </Modal>
  );
};

export default ChangePassword;
