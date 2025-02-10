import React from 'react';
import Modal from 'react-modal';
import Loader from '../loader';

import './style.scss';

const Loading = ({ visible }) => {
  return (
    <Modal
      ariaHideApp={false}
      className="loading-modal"
      closeTimeoutMS={150}
      contentLabel="Loading Data Modal"
      isOpen={visible}
    >
      <div id="loading-container">
        <p>Please wait while we load the data...</p>
        <div id="loading-animation">
          <Loader />
        </div>
      </div>
    </Modal>
  );
};

export default Loading;
