import React from 'react';

import { FilterBar, Loading } from '../../components';
import {
  MapWithControls,
} from './components';

import './style.scss';

const Home = (props) => {
  const { isLoading } = props;

  return (
    <>
      <div className="container">
        <Loading visible={isLoading} />
      </div>
      <div className="home-hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Annual Outbreak Predictions</h1>
          <p className="hero-description">
            This website predicts the likelihood of a summer outbreak based on spring trapping data,
            with the goal of assisting forest managers as they make resource allocation decisions.
          </p>
        </div>
      </div>
      <div className="filter-bar-wrapper">
        <FilterBar />
      </div>
      <div className="full-width-map">
        <MapWithControls />
      </div>
    </>
  );
};

export default Home;
