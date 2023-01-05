import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import './style.scss';

import { ROUTES } from '../../constants';
// eslint-disable-next-line import/no-cycle
import { DownloadData } from '..';

import pineBeetleImage from '../../assets/icons/black-beetle-logo.png';

const Header = (props) => {
  const routes = {
    [ROUTES.PREDICTIONS]: 'Predict Outbreak',
    [ROUTES.TRAPPING_DATA]: 'Historical Data',
    [ROUTES.PLAY_WITH_MODEL]: 'Play With Model',
    [ROUTES.ABOUT]: 'About',
  };

  const urlPath = useLocation().pathname;

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
                {Object.entries(routes).map(([key, value]) => (
                  <Link to={key} key={key} className={`${value === 'About' ? 'nav-button-short' : 'nav-button'} ${(urlPath === key) ? 'active-nav' : 'inactive-nav'}`}>
                    {value}
                  </Link>
                ))}
              </div>
              <div id="download-button-area">
                <DownloadData />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
