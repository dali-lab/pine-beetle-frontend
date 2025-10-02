import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { Loading, ScrollHint } from '../../components';
import { PredictionMap } from '../prediction/components';
import {
  HeroSection,
  HowItWorks,
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
        <HeroSection />
      </div>
      <div className="full-width-map">
        <PredictionMap />
      </div>
      <div className="container">
        <HowItWorks howItWorksRef={howItWorksRef} />
        <ScrollHint />
      </div>
    </>
  );
};

export default Home;
