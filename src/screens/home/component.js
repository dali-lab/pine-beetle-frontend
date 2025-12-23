import React from 'react';

import { Loader } from '../../components';
import MapWithControls from './components';

import './style.scss';

const Home = (props) => {
  const { isLoading } = props;

  return (
    <div className="map-page-wrapper">
      <div className="container">
        <Loader visible={isLoading} />
      </div>
      <div className="fullscreen-map">
        <MapWithControls />
      </div>
    </div>
  );
};

export default Home;
