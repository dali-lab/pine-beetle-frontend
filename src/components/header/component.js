import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import pineBeetleImage from '../../assets/icons/black-beetle-logo.png';
import { CHART_MODES, ROUTES } from '../../constants';
import { setChartMode as setChartModeAction } from '../../state/actions';

import './style.scss';

const Header = ({ setChartMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [historicalDataOpen, setHistoricalDataOpen] = useState(false);
  const navRef = useRef(null);
  const aboutButtonRef = useRef(null);
  const historicalDataButtonRef = useRef(null);
  const [aboutDropdownPosition, setAboutDropdownPosition] = useState({ top: 0, left: 0 });
  const [historicalDataDropdownPosition, setHistoricalDataDropdownPosition] = useState({ top: 0, left: 0 });

  const location = useLocation();

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setAboutOpen(false);
        setHistoricalDataOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleContactClick = () => {
    window.location.href = '/contact';
  };

  return (
    <header className="header">
      <div className="header-container">
        <nav className="header-nav">
          <Link to={ROUTES.HOME} className="header-logo">
            <div className="logo-image">
              <img src={pineBeetleImage} alt="SPB Logo" />
            </div>
          </Link>

          <div className="header-title">
            <h1>Southern Pine Beetle</h1>
            <h2>Outbreak Predictions</h2>
          </div>

          <div className="desktop-nav">
            {/* 1. Prediction Map */}
            <Link
              to={ROUTES.HOME}
              className={`nav-item ${location.pathname === ROUTES.HOME ? 'active' : ''}`}
              onMouseEnter={() => {
                setAboutOpen(false);
                setHistoricalDataOpen(false);
              }}
            >
              Prediction Map
            </Link>

            {/* 2. Data Dropdown */}
            <div
              className="nav-dropdown"
              ref={historicalDataButtonRef}
              onMouseEnter={() => {
                if (historicalDataButtonRef.current) {
                  const rect = historicalDataButtonRef.current.getBoundingClientRect();
                  setHistoricalDataDropdownPosition({
                    top: rect.bottom,
                    left: rect.left,
                  });
                }
                setAboutOpen(false);
                setHistoricalDataOpen(true);
              }}
            >
              <button
                type="button"
                className={`nav-item dropdown-trigger ${(location.pathname === ROUTES.HISTORICAL_GRAPH_VIEW || location.pathname === ROUTES.HISTORICAL_MAP_VIEW || location.pathname === ROUTES.DOWNLOAD_DATA) ? 'active' : ''}`}
              >
                Data
                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className="dropdown-menu-historical-data"
                onMouseEnter={() => setHistoricalDataOpen(true)}
                onMouseLeave={() => setHistoricalDataOpen(false)}
                style={{
                  display: historicalDataOpen ? 'block' : 'none',
                  top: `${historicalDataDropdownPosition.top}px`,
                  left: `${historicalDataDropdownPosition.left}px`,
                }}
              >
                <Link
                  to={ROUTES.HISTORICAL_VIEW}
                  className="dropdown-item"
                  onClick={() => {
                    setChartMode(CHART_MODES.GRAPH);
                    setHistoricalDataOpen(false);
                  }}
                >
                  Graph View
                </Link>
                <Link
                  to={ROUTES.DOWNLOAD_DATA}
                  className="dropdown-item"
                  onClick={() => setHistoricalDataOpen(false)}
                >
                  Download Data
                </Link>
              </div>
            </div>

            {/* 3. Comparison */}
            <Link
              to={ROUTES.RESULTS_COMPARISON}
              className={`nav-item ${location.pathname === ROUTES.RESULTS_COMPARISON ? 'active' : ''}`}
              onMouseEnter={() => {
                setAboutOpen(false);
                setHistoricalDataOpen(false);
              }}
            >
              Comparison
            </Link>

            {/* 4. Model */}
            <Link
              to={ROUTES.METHODOLOGY}
              className={`nav-item ${location.pathname === ROUTES.METHODOLOGY ? 'active' : ''}`}
              onMouseEnter={() => {
                setAboutOpen(false);
                setHistoricalDataOpen(false);
              }}
            >
              Model
            </Link>

            {/* 5. About Menu */}
            <div
              className="nav-dropdown"
              ref={aboutButtonRef}
              onMouseEnter={() => {
                if (aboutButtonRef.current) {
                  const rect = aboutButtonRef.current.getBoundingClientRect();
                  setAboutDropdownPosition({
                    top: rect.bottom,
                    left: rect.left,
                  });
                }
                setHistoricalDataOpen(false);
                setAboutOpen(true);
              }}
            >
              <button
                type="button"
                className={`nav-item dropdown-trigger ${(location.pathname === ROUTES.BLOG) ? 'active' : ''}`}
              >
                About
                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className="dropdown-menu-about"
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
                style={{
                  display: aboutOpen ? 'block' : 'none',
                  top: `${aboutDropdownPosition.top}px`,
                  left: `${aboutDropdownPosition.left}px`,
                }}
              >
                <Link
                  to={ROUTES.BLOG}
                  className="dropdown-item"
                  onClick={() => setAboutOpen(false)}
                >
                  Blog
                </Link>
                <a
                  href="https://www.spbpredict.com/resources"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dropdown-item"
                  onClick={() => setAboutOpen(false)}
                >
                  Resources
                </a>
                <a
                  href="https://www.spbpredict.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dropdown-item"
                  onClick={() => setAboutOpen(false)}
                >
                  About The Project
                </a>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    handleContactClick();
                    setAboutOpen(false);
                  }}
                >
                  Contact
                </button>
              </div>
            </div>
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
      <div className="mobile-nav" />
      )}

    </header>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setChartMode: (mode) => dispatch(setChartModeAction(mode)),
});

export default connect(null, mapDispatchToProps)(Header);
