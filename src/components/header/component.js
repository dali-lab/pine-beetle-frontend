import React from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';

import './style.scss';

import { ROUTES } from '../../constants';
import DownloadData from '../download-data';

import pineBeetleImage from '../../assets/icons/black-beetle-logo.png';

const Header = () => {
  const routes = {
    [ROUTES.RESOURCES]: 'Resources',
    [ROUTES.ABOUT]: 'About',
  };

  const urlPath = useLocation().pathname;

  const history = useHistory();
  const handleHowItWorksButtonClick = () => history.push('/?scrollTo=howItWorks');

  return (
    <div id="header">
      <div className="container">
        <div id="title-area">
          <div id="logo">
            <Link to={ROUTES.HOME}>
              <img src={pineBeetleImage} alt="logo" />
            </Link>
            <Link to={ROUTES.HOME} className={`nav-button ${(urlPath === '/') ? 'active-nav' : 'inactive-nav'}`}>
              Home
            </Link>
          </div>
          <div id="nav-button-area">
            <div id="nav-buttons">
              <div id="button-container">
                <button type="button" onClick={handleHowItWorksButtonClick} className="nav-button inactive-nav">How does it work?</button>
                {Object.entries(routes).map(([key, value]) => (
                  <Link to={key} key={key} className={`${value === 'About' ? 'nav-button-short' : 'nav-button'} ${(urlPath === key) ? 'active-nav' : 'inactive-nav'}`}>
                    {value}
                  </Link>
                ))}
              </div>
              <div id="download-button-area">
                {urlPath === ROUTES.TRAPPING_DATA && <DownloadData />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
