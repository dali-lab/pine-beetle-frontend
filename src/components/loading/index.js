import React from 'react';
import Lottie from 'react-lottie';
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

const Loading = () => {
  return (
    <div>
      <div id="loading-container">
        <div id="loading-animation">
          <Lottie
            options={defaultOptions}
            isClickToPauseDisabled
          />
        </div>
        <p>Please wait while we load the data...</p>
      </div>
    </div>
  );
};

export default Loading;
