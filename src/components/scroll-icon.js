import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assets/animations/scroll-icon.json';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const ScrollIcon = () => (
  <Lottie options={defaultOptions}
    height={50}
    width={75}
  />
);

export default ScrollIcon;
