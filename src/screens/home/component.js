import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { FilterBar, Loading, ScrollHint } from '../../components';
import {
  HowItWorks,
  MapWithControls,
} from './components';

import './style.scss';

const Home = (props) => {
  const { isLoading } = props;

  const howItWorksRef = useRef(null);
  const location = useLocation();

  // scroll to the "How does it work?" section whenever a respective nav button is clicked
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (!isLoading && searchParams.get('scrollTo') === 'howItWorks' && howItWorksRef.current) {
      setTimeout(() => howItWorksRef.current.scrollIntoView({ behavior: 'smooth' }), 200);
    }
  }, [location.search, isLoading]);

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
      <div className="container">
        <HowItWorks howItWorksRef={howItWorksRef} />
        <ScrollHint />
      </div>
    </>
  );
};

export default Home;
