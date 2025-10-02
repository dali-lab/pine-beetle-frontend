import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import pineBeetleImage from '../../assets/icons/black-beetle-logo.png';
import { ROUTES } from '../../constants';

import './style.scss';

const Header = () => {
  const [dataMenuOpen, setDataMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const history = useHistory();

  const scrollToUrl = '?scrollTo=howItWorks';

  const handleHowItWorksButtonClick = () => {
    // handle situation when user wants to go back to how does it work section, after already clicking on the button
    if (location.pathname === ROUTES.HOME && location.search === scrollToUrl) {
      history.push(ROUTES.HOME);
      setTimeout(() => {
        history.push(`/${scrollToUrl}`);
      }, 0);
    } else {
      history.push(`/${scrollToUrl}`);
    }
  };

  const handleContactClick = () => {
    // Scroll to contact section or handle contact action
    console.log('Contact clicked');
  };

  return (
    <header className="header">
      <div className="header-container">
        <nav className="header-nav">
          <Link to={ROUTES.HOME} className="header-logo">
            <div className="logo-image">
              <img src={pineBeetleImage} alt="SPB Logo" />
            </div>
            <span className="logo-text">SPB Predict</span>
          </Link>

          <div className="desktop-nav">
            <Link to={ROUTES.PREDICTIONS} className="nav-link">
              Predictions
            </Link>

            {/* Data Menu with hover/click functionality */}
            <div
              className="nav-dropdown"
              onMouseEnter={() => setDataMenuOpen(true)}
              onMouseLeave={() => setDataMenuOpen(false)}
            >
              <button type="button" className="nav-link dropdown-trigger">
                Data
                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dataMenuOpen && (
                <div className="dropdown-menu">
                  <Link to={ROUTES.TRAPPING_DATA} className="dropdown-item">
                    Time Series / Annual Trends
                  </Link>
                  <Link to="/data/tables" className="dropdown-item">
                    Data Tables
                  </Link>
                  <Link to="/data/graphs" className="dropdown-item">
                    Data Graphs
                  </Link>
                  <Link to="/data/download" className="dropdown-item">
                    Download Data
                  </Link>
                </div>
              )}
            </div>

            <button type="button" onClick={handleHowItWorksButtonClick} className="nav-link">
              Methodology
            </button>
            <Link to={ROUTES.ABOUT} className="nav-link">
              About
            </Link>
            <button type="button" onClick={handleContactClick} className="contact-button">
              Contact
            </button>
          </div>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="hamburger-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav">
          <Link to={ROUTES.PREDICTIONS} className="mobile-nav-link">
            Predictions
          </Link>

          <div className="mobile-nav-section">
            <span className="mobile-nav-label">Data</span>
            <Link to={ROUTES.TRAPPING_DATA} className="mobile-nav-sublink">
              Time Series / Annual Trends
            </Link>
            <Link to="/data/tables" className="mobile-nav-sublink">
              Data Tables
            </Link>
            <Link to="/data/graphs" className="mobile-nav-sublink">
              Data Graphs
            </Link>
            <Link to="/data/download" className="mobile-nav-sublink">
              Download Data
            </Link>
          </div>

          <button type="button" onClick={handleHowItWorksButtonClick} className="mobile-nav-link">
            Methodology
          </button>
          <Link to={ROUTES.ABOUT} className="mobile-nav-link">
            About
          </Link>
          <button type="button" onClick={handleContactClick} className="mobile-contact-button">
            Contact
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
