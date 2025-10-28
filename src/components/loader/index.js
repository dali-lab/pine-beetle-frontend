import React from 'react';
import Modal from 'react-modal';

import './style.scss';

const Loader = ({ visible, message = 'Loading...', inline = false }) => {
  const spinnerContent = (
    <div className={inline ? 'loading-container loading-container--inline' : 'loading-container'}>
      <div className="loading-spinner">
        <div className="spinner-ring" />
        <div className="spinner-ring" />
        <div className="spinner-ring" />
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  if (inline) {
    return spinnerContent;
  }

  return (
    <Modal
      ariaHideApp={false}
      className="loading-modal"
      closeTimeoutMS={200}
      contentLabel="Loading Data Modal"
      isOpen={visible}
      overlayClassName="loading-overlay"
    >
      {spinnerContent}
    </Modal>
  );
};

export default Loader;
