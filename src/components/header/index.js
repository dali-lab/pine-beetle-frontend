import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const pineBeetleImage = require('../../assets/pinebeetle.png');

const Header = () => {
  const routes = {
    '/historical-data': 'HISTORICAL DATA',
    '/predictions': 'PREDICTIONS',
    '/about': 'ABOUT',
    '/how-it-works': 'HOW IT WORKS',
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
