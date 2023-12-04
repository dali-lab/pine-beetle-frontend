import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import {
  BlogPost, HeroSection, HistoricalData, HowItWorks, MiniMap, Video,
} from './components';

import './style.scss';

const Home = () => {
  const howItWorksRef = useRef(null);
  const location = useLocation();

  // scroll to the "How does it work?" section whenever a respective nav button is clicked
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('scrollTo') === 'howItWorks' && howItWorksRef.current) {
      howItWorksRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.search]);

  return (
    <div className="container" id="home-container">
      <HeroSection />
      <div className="home-content">
        <MiniMap />
        <BlogPost />
        <div className="page-container" style={{ height: '200px' }}>1st section</div>
        <div className="home-content-section">
          <HistoricalData />
          <Video />
        </div>
      </div>
      <HowItWorks howItWorksRef={howItWorksRef} />
    </div>
  );
};

export default Home;
