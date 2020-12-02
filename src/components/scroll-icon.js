import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assets/animations/animation-arrow.json';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const ScrollIcon = () => (
  <Lottie
    options={defaultOptions}
    isClickToPauseDisabled
  />
);

export default ScrollIcon;
