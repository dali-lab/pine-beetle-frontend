import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
// import { ROUTES, VIDEO_URL } from '../../constants';
import './style.scss';

import HeroSection from './components/hero-section';
import HowItWorks from './components/how-does-it-work';

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
      {/* <div className="pages">
        <div className="page-container" id="left-page-container">
          <div id="page-name">Predictions</div>
          <div id="summary">
            Predictions are updated weekly as trapping data are entered, and can be viewed by counties within states, as well as by USFS ranger districts within National Forests.
          </div>
          <Link to={ROUTES.PREDICTIONS} className="animated-button" id="click-to">
            View predictions
          </Link>
        </div>
        <div className="page-container">
          <div id="page-name">Historical Data</div>
          <div id="summary">
            Trapping data collected since 1988 were used to build the prediction model on this website. View and download the data here. Data can be filtered by years and/or locations.
          </div>
          <Link to={ROUTES.TRAPPING_DATA} className="animated-button" id="click-to">
            View trapping data
          </Link>
        </div>
        <div className="page-container" id="right-page-container">
          <div id="page-name">Play with the model</div>
          <div id="summary">
            Trapping data collected since 1988 were used to build the prediction model on this website. View and download the data here with years and/or location filters.
          </div>
          <Link to={ROUTES.PLAY_WITH_MODEL} className="animated-button" id="click-to">
            Play with the model
          </Link>
        </div>
      </div> */}
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
