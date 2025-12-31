import React, { useEffect } from 'react';

import { Loader } from '../../components';
import MapWithControls from './components';

import './style.scss';

const Home = (props) => {
  const { isLoading, clearAllSelections } = props;

  // Reset selections to defaults whenever Home component mounts
  useEffect(() => {
    if (clearAllSelections) {
      clearAllSelections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run on mount/unmount

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
