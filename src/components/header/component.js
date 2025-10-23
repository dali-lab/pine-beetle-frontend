import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import pineBeetleImage from '../../assets/icons/black-beetle-logo.png';
import { ROUTES } from '../../constants';
import { setChartMode as setChartModeAction } from '../../state/actions';

import './style.scss';

const Header = ({ setChartMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [historicalDataOpen, setHistoricalDataOpen] = useState(false);
  const [explainersOpen, setExplainersOpen] = useState(false);
  const navRef = useRef(null);
  const aboutButtonRef = useRef(null);
  const historicalDataButtonRef = useRef(null);
  const explainersButtonRef = useRef(null);
  const historicalDataTimeoutRef = useRef(null);
  const aboutTimeoutRef = useRef(null);
  const explainersTimeoutRef = useRef(null);
  const [aboutDropdownPosition, setAboutDropdownPosition] = useState({ top: 0, left: 0 });
  const [historicalDataDropdownPosition, setHistoricalDataDropdownPosition] = useState({ top: 0, left: 0 });
  const [explainersDropdownPosition, setExplainersDropdownPosition] = useState({ top: 0, left: 0 });

  const location = useLocation();

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setAboutOpen(false);
        setHistoricalDataOpen(false);
        setExplainersOpen(false);
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
          <Link to={ROUTES.HOME} className="header-logo-title">
            <div className="logo-image">
              <img src={pineBeetleImage} alt="SPB Logo" />
            </div>
            <div className="header-title">
              <h1>Southern Pine Beetle</h1>
              <h2>Outbreak Predictions</h2>
            </div>
          </Link>

          <div className="desktop-nav">
            {/* 1. Prediction Map */}
            <Link
              to={ROUTES.HOME}
              className={`nav-item ${location.pathname === ROUTES.HOME ? 'active' : ''}`}
            >
              Prediction Map
            </Link>

            {/* 2. Observed Outcomes */}
            <Link
              to={ROUTES.RESULTS_COMPARISON}
              className={`nav-item ${location.pathname === ROUTES.RESULTS_COMPARISON ? 'active' : ''}`}
            >
              Observed Outcomes
            </Link>

            {/* 3. Historical Data Dropdown */}
            <div
              className="nav-dropdown"
              ref={historicalDataButtonRef}
              onMouseLeave={() => {
                historicalDataTimeoutRef.current = setTimeout(() => {
                  setHistoricalDataOpen(false);
                }, 150);
              }}
              onMouseEnter={() => {
                if (historicalDataTimeoutRef.current) {
                  clearTimeout(historicalDataTimeoutRef.current);
                }
                if (historicalDataButtonRef.current) {
                  const rect = historicalDataButtonRef.current.getBoundingClientRect();
                  const dropdownWidth = 192;
                  const rightEdge = rect.left + dropdownWidth;
                  const viewportWidth = window.innerWidth;

                  const leftPosition = rightEdge > viewportWidth
                    ? rect.right - dropdownWidth
                    : rect.left;

                  setHistoricalDataDropdownPosition({
                    top: rect.bottom,
                    left: leftPosition,
                  });
                }
                setAboutOpen(false);
                setHistoricalDataOpen(true);
              }}
            >
              <Link
                to={ROUTES.DATA}
                className={`nav-item dropdown-trigger ${(location.pathname === ROUTES.DATA || location.pathname === ROUTES.DATA_TABLE || location.pathname === ROUTES.HISTORICAL_GRAPH_VIEW || location.pathname === ROUTES.HISTORICAL_MAP_VIEW || location.pathname === ROUTES.DOWNLOAD_DATA) ? 'active' : ''}`}
                onClick={() => setHistoricalDataOpen(false)}
              >
                Data
                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              <div
                className={`dropdown-menu-historical-data ${historicalDataOpen ? 'show' : ''}`}
                onMouseEnter={() => {
                  if (historicalDataTimeoutRef.current) {
                    clearTimeout(historicalDataTimeoutRef.current);
                  }
                  setHistoricalDataOpen(true);
                }}
                onMouseLeave={() => {
                  historicalDataTimeoutRef.current = setTimeout(() => {
                    setHistoricalDataOpen(false);
                  }, 150);
                }}
                style={{
                  top: `${historicalDataDropdownPosition.top}px`,
                  left: `${historicalDataDropdownPosition.left}px`,
                }}
              >
                <Link
                  to={ROUTES.HISTORICAL_VIEW}
                  className={`dropdown-item ${location.pathname === ROUTES.HISTORICAL_VIEW ? 'active' : ''}`}
                  onClick={() => setHistoricalDataOpen(false)}
                >
                  Time Series
                </Link>
                <Link
                  to={ROUTES.DATA_TABLE}
                  className={`dropdown-item ${location.pathname === ROUTES.DATA_TABLE ? 'active' : ''}`}
                  onClick={() => setHistoricalDataOpen(false)}
                >
                  Data Tables
                </Link>
                <Link
                  to={ROUTES.DOWNLOAD_DATA}
                  className={`dropdown-item ${location.pathname === ROUTES.DOWNLOAD_DATA ? 'active' : ''}`}
                  onClick={() => setHistoricalDataOpen(false)}
                >
                  Download Data
                </Link>
              </div>
            </div>

            {/* 4. Explainers and Other Details Dropdown */}
            <div
              className="nav-dropdown"
              ref={explainersButtonRef}
              onMouseLeave={() => {
                explainersTimeoutRef.current = setTimeout(() => {
                  setExplainersOpen(false);
                }, 150);
              }}
              onMouseEnter={() => {
                if (explainersTimeoutRef.current) {
                  clearTimeout(explainersTimeoutRef.current);
                }
                if (explainersButtonRef.current) {
                  const rect = explainersButtonRef.current.getBoundingClientRect();
                  const dropdownWidth = 192; // min-width from CSS
                  const rightEdge = rect.left + dropdownWidth;
                  const viewportWidth = window.innerWidth;

                  const leftPosition = rightEdge > viewportWidth
                    ? rect.right - dropdownWidth
                    : rect.left;

                  setExplainersDropdownPosition({
                    top: rect.bottom,
                    left: leftPosition,
                  });
                }
                setAboutOpen(false);
                setHistoricalDataOpen(false);
                setExplainersOpen(true);
              }}
            >
              <Link
                to={ROUTES.EXPLAINERS}
                className={`nav-item dropdown-trigger ${(location.pathname === ROUTES.EXPLAINERS || location.pathname === ROUTES.METHODOLOGY || location.pathname === ROUTES.PLAY_WITH_MODEL || location.pathname === ROUTES.RESOURCES) ? 'active' : ''}`}
                onClick={() => setExplainersOpen(false)}
              >
                Explainers & Details
                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              <div
                className={`dropdown-menu-explainers ${explainersOpen ? 'show' : ''}`}
                onMouseEnter={() => {
                  if (explainersTimeoutRef.current) {
                    clearTimeout(explainersTimeoutRef.current);
                  }
                  setExplainersOpen(true);
                }}
                onMouseLeave={() => {
                  explainersTimeoutRef.current = setTimeout(() => {
                    setExplainersOpen(false);
                  }, 150);
                }}
                style={{
                  top: `${explainersDropdownPosition.top}px`,
                  left: `${explainersDropdownPosition.left}px`,
                }}
              >
                <a
                  href="https://drive.google.com/file/d/1lp0-8pCiAkaXqVclcxjjSx4RcBKGeH3M/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dropdown-item"
                  onClick={() => setExplainersOpen(false)}
                >
                  Interpreting Probabilities (the video)
                </a>
                <Link
                  to={ROUTES.METHODOLOGY}
                  className={`dropdown-item ${location.pathname === ROUTES.METHODOLOGY ? 'active' : ''}`}
                  onClick={() => setExplainersOpen(false)}
                >
                  Model Methodology
                </Link>
                <Link
                  to={ROUTES.PLAY_WITH_MODEL}
                  className={`dropdown-item ${location.pathname === ROUTES.PLAY_WITH_MODEL ? 'active' : ''}`}
                  onClick={() => setExplainersOpen(false)}
                >
                  Model Explorer
                </Link>
                <Link
                  to={ROUTES.RESOURCES}
                  className={`dropdown-item ${location.pathname === ROUTES.RESOURCES ? 'active' : ''}`}
                  onClick={() => setExplainersOpen(false)}
                >
                  Resources
                </Link>
              </div>
            </div>

            {/* 5. Blog */}
            <Link
              to={ROUTES.BLOG}
              className={`nav-item ${location.pathname === ROUTES.BLOG ? 'active' : ''}`}
            >
              Blog
            </Link>

            {/* 6. About Menu */}
            <div
              className="nav-dropdown"
              ref={aboutButtonRef}
              onMouseLeave={() => {
                aboutTimeoutRef.current = setTimeout(() => {
                  setAboutOpen(false);
                }, 150);
              }}
              onMouseEnter={() => {
                if (aboutTimeoutRef.current) {
                  clearTimeout(aboutTimeoutRef.current);
                }
                if (aboutButtonRef.current) {
                  const rect = aboutButtonRef.current.getBoundingClientRect();
                  const dropdownWidth = 192; // min-width from CSS
                  const rightEdge = rect.left + dropdownWidth;
                  const viewportWidth = window.innerWidth;

                  const leftPosition = rightEdge > viewportWidth
                    ? rect.right - dropdownWidth
                    : rect.left;

                  setAboutDropdownPosition({
                    top: rect.bottom,
                    left: leftPosition,
                  });
                }
                setAboutOpen(true);
              }}
            >
              <button
                type="button"
                className={`nav-item dropdown-trigger ${(location.pathname === ROUTES.ABOUT) ? 'active' : ''}`}
              >
                About
                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`dropdown-menu-about ${aboutOpen ? 'show' : ''}`}
                onMouseEnter={() => {
                  if (aboutTimeoutRef.current) {
                    clearTimeout(aboutTimeoutRef.current);
                  }
                  setAboutOpen(true);
                }}
                onMouseLeave={() => {
                  aboutTimeoutRef.current = setTimeout(() => {
                    setAboutOpen(false);
                  }, 150);
                }}
                style={{
                  top: `${aboutDropdownPosition.top}px`,
                  left: `${aboutDropdownPosition.left}px`,
                }}
              >
                <Link
                  to={ROUTES.ABOUT}
                  className={`dropdown-item ${location.pathname === ROUTES.ABOUT ? 'active' : ''}`}
                  onClick={() => setAboutOpen(false)}
                >
                  About The Project
                </Link>
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
        <div className="mobile-nav">
          <Link
            to={ROUTES.HOME}
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Prediction Map
          </Link>

          <div className="mobile-nav-section">
            <Link
              to={ROUTES.DATA}
              className="mobile-nav-label"
              onClick={() => setMobileMenuOpen(false)}
            >
              Historical Data
            </Link>
            <Link
              to={ROUTES.DATA}
              className="mobile-nav-sublink"
              onClick={() => setMobileMenuOpen(false)}
            >
              Time Series
            </Link>
            <Link
              to={ROUTES.DATA_TABLE}
              className="mobile-nav-sublink"
              onClick={() => setMobileMenuOpen(false)}
            >
              Data Table
            </Link>
            <Link
              to={ROUTES.DOWNLOAD_DATA}
              className="mobile-nav-sublink"
              onClick={() => setMobileMenuOpen(false)}
            >
              Download Data
            </Link>
          </div>

          <Link
            to={ROUTES.RESULTS_COMPARISON}
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Observed Outcomes
          </Link>

          <div className="mobile-nav-section">
            <Link
              to={ROUTES.EXPLAINERS}
              className="mobile-nav-label"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explainers and Other Details
            </Link>
            <a
              href="https://drive.google.com/file/d/1lp0-8pCiAkaXqVclcxjjSx4RcBKGeH3M/view"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-nav-sublink"
              onClick={() => setMobileMenuOpen(false)}
            >
              Interpreting Probabilities (the video)
            </a>
            <Link
              to={ROUTES.METHODOLOGY}
              className="mobile-nav-sublink"
              onClick={() => setMobileMenuOpen(false)}
            >
              Model Methodology
            </Link>
            <Link
              to={ROUTES.PLAY_WITH_MODEL}
              className="mobile-nav-sublink"
              onClick={() => setMobileMenuOpen(false)}
            >
              Model Explorer
            </Link>
            <Link
              to={ROUTES.RESOURCES}
              className="mobile-nav-sublink"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </Link>
          </div>

          <Link
            to={ROUTES.BLOG}
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Blog
          </Link>

          <div className="mobile-nav-section">
            <Link
              to={ROUTES.ABOUT}
              className="mobile-nav-label"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to={ROUTES.ABOUT}
              className="mobile-nav-sublink"
              onClick={() => setMobileMenuOpen(false)}
            >
              About The Project
            </Link>
            <button
              type="button"
              className="mobile-nav-sublink"
              onClick={() => {
                handleContactClick();
                setMobileMenuOpen(false);
              }}
            >
              Contact
            </button>
          </div>
        </div>
      )}

    </header>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setChartMode: (mode) => dispatch(setChartModeAction(mode)),
});

export default connect(null, mapDispatchToProps)(Header);
