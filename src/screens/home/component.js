import React from 'react';

import { FilterBar, Footer, Loading } from '../../components';
import {
  MapWithControls,
} from './components';

import './style.scss';

const Home = (props) => {
  const { isLoading } = props;

  return (
    <div className="home-page-wrapper">
      <div className="container">
        <Loading visible={isLoading} />
      </div>
      <div className="filter-bar-wrapper">
        <FilterBar />
      </div>
      <div className="fullscreen-map">
        <MapWithControls />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
