import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
// import { ROUTES, VIDEO_URL } from '../../constants';
import './style.scss';

import {
  BlogPost, HeroSection, HowItWorks, MiniMap,
} from './components';

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
        <div className="page-container">2nd section</div>
      </div>
      {/* <div id="video-container">
        <div id="video-wrapper">
          <iframe
            title="Pine Beetle Description Video"
            src={VIDEO_URL}
            frameBorder="0"
            width="100%"
            height="100%"
          />
        </div>
      </div> */}
      <HowItWorks howItWorksRef={howItWorksRef} />
    </div>
  );
};

export default Home;
