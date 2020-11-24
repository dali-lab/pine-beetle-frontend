import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import './style.scss';

import { ROUTES, DATA_MODES } from '../../constants';

const pineBeetleImage = require('../../assets/icons/black-beetle-logo.png');

const Header = (props) => {
  const {
    dataMode,
    setDataMode,
  } = props;

  const routes = {
    [ROUTES.TRAPPING_DATA]: 'Trapping Data',
    [ROUTES.PREDICTIONS]: 'Predict Outbreak',
    [ROUTES.PLAY_WITH_MODEL]: 'Play With Model',
  };

  const setCountyMode = () => setDataMode(DATA_MODES.COUNTY);
  const setRangerDistrictMode = () => setDataMode(DATA_MODES.RANGER_DISTRICT);

  return (
    <div id="header">
      <div className="container">
        <div id="title-area">
          <div id="logo">
            <Link to={ROUTES.HOME}>
              <img src={pineBeetleImage} alt="logo" />
            </Link>
            <Link to={ROUTES.HOME} className={`nav-button ${(useLocation().pathname === '/') ? 'active-nav' : 'inactive-nav'}`}>
              Home
            </Link>
          </div>
          <div id="nav-button-area">
            <div id="nav-buttons">
              {Object.entries(routes).map(([key, value]) => (
                <Link to={key} key={key} className={`nav-button ${(useLocation().pathname === key) ? 'active-nav' : 'inactive-nav'}`}>
                  {value}
                </Link>
              ))}
              <div id="data-mode-toggle-container">
                <button
                  className={`data-mode-button ${dataMode === DATA_MODES.COUNTY ? 'selected' : 'unselected'}`}
                  type="button"
                  onClick={setCountyMode}
                >County
                </button>
                <button
                  className={`data-mode-button ${dataMode === DATA_MODES.RANGER_DISTRICT ? 'selected' : 'unselected'}`}
                  type="button"
                  onClick={setRangerDistrictMode}
                >Ranger District
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
