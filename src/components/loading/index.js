import React from 'react';
import Modal from 'react-modal';

import './style.scss';

const Loading = ({ visible, message = 'Loading...' }) => {
  return (
    <Modal
      ariaHideApp={false}
      className="loading-modal"
      closeTimeoutMS={200}
      contentLabel="Loading Data Modal"
      isOpen={visible}
      overlayClassName="loading-overlay"
    >
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-ring" />
          <div className="spinner-ring" />
          <div className="spinner-ring" />
        </div>
        <p className="loading-message">{message}</p>
      </div>
    </Modal>
  );
};

export default Loading;
