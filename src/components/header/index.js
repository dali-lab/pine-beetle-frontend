import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';
import { ROUTES } from '../../constants';

const pineBeetleImage = require('../../assets/black_beetle_logo.png');

const Header = () => {
  const routes = {
    [ROUTES.HOME]: 'Home',
    [ROUTES.HISTORICAL_DATA]: 'Trapping Data',
    [ROUTES.PREDICTIONS]: 'Predict Outbreak',
    [ROUTES.PLAY_WITH_MODEL]: 'Play With Model',
  };

  return (
    <div id="header">
      <div className="container">
        <div id="title-area">
          <div id="logo">
            <Link to="/"><img src={pineBeetleImage} alt="logo" /></Link>
          </div>
          <div id="nav-button-area">
            <div id="nav-buttons">
              {Object.entries(routes).map(([key, value]) => (
                <Link to={key}><p>{value}</p></Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ clear: 'both' }} />
    </div>
  );
};

export default Header;
