import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { Loading, ScrollHint, Tabs } from '../../components';
import {
  HistoricalData,
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

  const tabs = [
    {
      label: 'Map View',
      content: (
        <div className="full-width-map">
          <MapWithControls />
        </div>
      ),
    },
    {
      label: 'Historical Data',
      content: (
        <div className="tabs-content-container">
          <div className="historical-data-section">
            <HistoricalData />
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="container">
        <Loading visible={isLoading} />
      </div>
      <div className="home-tabs-section">
        <Tabs tabs={tabs} defaultTab={0} />
      </div>
      <div className="container">
        <HowItWorks howItWorksRef={howItWorksRef} />
        <ScrollHint />
      </div>
    </>
  );
};

export default Home;
