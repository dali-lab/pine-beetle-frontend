import React from 'react';
import Lottie from 'react-lottie';
import Modal from 'react-modal';

import animationData from '../../assets/animations/loading.json';

import './style.scss';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

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
          <Lottie
            options={defaultOptions}
            isClickToPauseDisabled
          />
        </div>
      </div>
    </Modal>
  );
};

export default Loading;
