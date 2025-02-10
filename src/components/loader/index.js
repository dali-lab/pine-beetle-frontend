import React from 'react';
import Lottie from 'react-lottie';

import animationData from '../../assets/animations/loading.json';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const Loader = () => {
  return (
    <Lottie
      options={defaultOptions}
      isClickToPauseDisabled
    />
  );
};

export default Loader;
