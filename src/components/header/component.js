import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import pineBeetleImage from '../../assets/icons/black-beetle-logo.png';
import { ROUTES, VIDEO_URL } from '../../constants';
import useDropdown from '../../hooks/useDropdown';

import './style.scss';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const history = useHistory();
  const location = useLocation();

  const aboutDropdown = useDropdown(false);
  const historicalDataDropdown = useDropdown(false);
  const explainersDropdown = useDropdown(false);

  const closeAllDropdownsRef = useRef(() => {});

  useEffect(() => {
    closeAllDropdownsRef.current = () => {
      aboutDropdown.closeDropdown();
      historicalDataDropdown.closeDropdown();
      explainersDropdown.closeDropdown();
    };
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeAllDropdownsRef.current();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeAllDropdownsRef.current();
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleContactClick = useCallback(() => {
    history.push(ROUTES.CONTACT);
  }, [history]);

  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleAboutMouseEnter = useCallback(() => {
    historicalDataDropdown.closeDropdown();
    explainersDropdown.closeDropdown();
    aboutDropdown.handleMouseEnter();
  }, [aboutDropdown, historicalDataDropdown, explainersDropdown]);

  const handleHistoricalDataMouseEnter = useCallback(() => {
    aboutDropdown.closeDropdown();
    explainersDropdown.closeDropdown();
    historicalDataDropdown.handleMouseEnter();
  }, [aboutDropdown, historicalDataDropdown, explainersDropdown]);

  const handleExplainersMouseEnter = useCallback(() => {
    aboutDropdown.closeDropdown();
    historicalDataDropdown.closeDropdown();
    explainersDropdown.handleMouseEnter();
  }, [aboutDropdown, historicalDataDropdown, explainersDropdown]);

  const isActiveRoute = useCallback((routes) => {
    if (Array.isArray(routes)) {
      return routes.some((route) => location.pathname === route);
    }
    return location.pathname === routes;
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="header-container">
        <nav className="header-nav" ref={navRef}>
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
              className={`nav-item ${isActiveRoute(ROUTES.HOME) ? 'active' : ''}`}
            >
              Prediction Map
            </Link>

            {/* 2. Observed Outcomes */}
            <Link
              to={ROUTES.RESULTS_COMPARISON}
              className={`nav-item ${isActiveRoute(ROUTES.RESULTS_COMPARISON) ? 'active' : ''}`}
            >
              Observed Outcomes
            </Link>

            {/* 3. Historical Data Dropdown */}
            <div
              className="nav-dropdown"
              ref={historicalDataDropdown.buttonRef}
              onMouseLeave={historicalDataDropdown.handleMouseLeave}
              onMouseEnter={handleHistoricalDataMouseEnter}
            >
              <Link
                to={ROUTES.DATA}
                className={`nav-item dropdown-trigger ${isActiveRoute([ROUTES.DATA, ROUTES.DATA_TABLE, ROUTES.TIME_SERIES, ROUTES.DOWNLOAD_DATA]) ? 'active' : ''}`}
                onClick={historicalDataDropdown.closeDropdown}
                aria-expanded={historicalDataDropdown.isOpen}
                aria-haspopup="true"
              >
                Data
                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              <div
                className={`dropdown-menu-historical-data ${historicalDataDropdown.isOpen ? 'show' : ''}`}
                onMouseEnter={historicalDataDropdown.handleDropdownMouseEnter}
                onMouseLeave={historicalDataDropdown.handleDropdownMouseLeave}
                style={{
                  top: `${historicalDataDropdown.position.top}px`,
                  left: `${historicalDataDropdown.position.left}px`,
                }}
              >
                <Link
                  to={ROUTES.TIME_SERIES}
                  className={`dropdown-item ${isActiveRoute(ROUTES.TIME_SERIES) ? 'active' : ''}`}
                  onClick={historicalDataDropdown.closeDropdown}
                  role="menuitem"
                >
                  Time Series
                </Link>
                <Link
                  to={ROUTES.DATA_TABLE}
                  className={`dropdown-item ${isActiveRoute(ROUTES.DATA_TABLE) ? 'active' : ''}`}
                  onClick={historicalDataDropdown.closeDropdown}
                  role="menuitem"
                >
                  Data Tables
                </Link>
                <Link
                  to={ROUTES.DOWNLOAD_DATA}
                  className={`dropdown-item ${isActiveRoute(ROUTES.DOWNLOAD_DATA) ? 'active' : ''}`}
                  onClick={historicalDataDropdown.closeDropdown}
                  role="menuitem"
                >
                  Download Data
                </Link>
              </div>
            </div>

            {/* 4. Explainers and Other Details Dropdown */}
            <div
              className="nav-dropdown"
              ref={explainersDropdown.buttonRef}
              onMouseLeave={explainersDropdown.handleMouseLeave}
              onMouseEnter={handleExplainersMouseEnter}
            >
              <Link
                to={ROUTES.EXPLAINERS}
                className={`nav-item dropdown-trigger ${isActiveRoute([ROUTES.EXPLAINERS, ROUTES.METHODOLOGY, ROUTES.PLAY_WITH_MODEL, ROUTES.RESOURCES]) ? 'active' : ''}`}
                onClick={explainersDropdown.closeDropdown}
                aria-expanded={explainersDropdown.isOpen}
                aria-haspopup="true"
              >
                Explainers & Details
                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              <div
                className={`dropdown-menu-explainers ${explainersDropdown.isOpen ? 'show' : ''}`}
                onMouseEnter={explainersDropdown.handleDropdownMouseEnter}
                onMouseLeave={explainersDropdown.handleDropdownMouseLeave}
                style={{
                  top: `${explainersDropdown.position.top}px`,
                  left: `${explainersDropdown.position.left}px`,
                }}
              >
                <a
                  href={VIDEO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dropdown-item"
                  onClick={explainersDropdown.closeDropdown}
                  role="menuitem"
                >
                  Interpreting Probabilities (the video)
                </a>
                <Link
                  to={ROUTES.METHODOLOGY}
                  className={`dropdown-item ${isActiveRoute(ROUTES.METHODOLOGY) ? 'active' : ''}`}
                  onClick={explainersDropdown.closeDropdown}
                  role="menuitem"
                >
                  Model Methodology
                </Link>
                <Link
                  to={ROUTES.PLAY_WITH_MODEL}
                  className={`dropdown-item ${isActiveRoute(ROUTES.PLAY_WITH_MODEL) ? 'active' : ''}`}
                  onClick={explainersDropdown.closeDropdown}
                  role="menuitem"
                >
                  Model Explorer
                </Link>
                <Link
                  to={ROUTES.RESOURCES}
                  className={`dropdown-item ${isActiveRoute(ROUTES.RESOURCES) ? 'active' : ''}`}
                  onClick={explainersDropdown.closeDropdown}
                  role="menuitem"
                >
                  Resources
                </Link>
              </div>
            </div>

            {/* 5. Blog */}
            <Link
              to={ROUTES.BLOG}
              className={`nav-item ${isActiveRoute(ROUTES.BLOG) ? 'active' : ''}`}
            >
              Blog
            </Link>

            {/* 6. About Menu */}
            <div
              className="nav-dropdown"
              ref={aboutDropdown.buttonRef}
              onMouseLeave={aboutDropdown.handleMouseLeave}
              onMouseEnter={handleAboutMouseEnter}
            >
              <button
                type="button"
                className={`nav-item dropdown-trigger ${isActiveRoute(ROUTES.ABOUT) ? 'active' : ''}`}
                aria-expanded={aboutDropdown.isOpen}
                aria-haspopup="true"
              >
                About
                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`dropdown-menu-about ${aboutDropdown.isOpen ? 'show' : ''}`}
                onMouseEnter={aboutDropdown.handleDropdownMouseEnter}
                onMouseLeave={aboutDropdown.handleDropdownMouseLeave}
                style={{
                  top: `${aboutDropdown.position.top}px`,
                  left: `${aboutDropdown.position.left}px`,
                }}
              >
                <Link
                  to={ROUTES.ABOUT}
                  className={`dropdown-item ${isActiveRoute(ROUTES.ABOUT) ? 'active' : ''}`}
                  onClick={aboutDropdown.closeDropdown}
                  role="menuitem"
                >
                  About The Project
                </Link>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    handleContactClick();
                    aboutDropdown.closeDropdown();
                  }}
                  role="menuitem"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={handleMobileMenuToggle}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            <svg className="hamburger-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav" role="navigation" aria-label="Mobile navigation">
          <Link
            to={ROUTES.HOME}
            className="mobile-nav-link"
            onClick={handleMobileMenuClose}
          >
            Prediction Map
          </Link>

          <div className="mobile-nav-section">
            <Link
              to={ROUTES.DATA}
              className="mobile-nav-label"
              onClick={handleMobileMenuClose}
            >
              Historical Data
            </Link>
            <Link
              to={ROUTES.TIME_SERIES}
              className="mobile-nav-sublink"
              onClick={handleMobileMenuClose}
            >
              Time Series
            </Link>
            <Link
              to={ROUTES.DATA_TABLE}
              className="mobile-nav-sublink"
              onClick={handleMobileMenuClose}
            >
              Data Table
            </Link>
            <Link
              to={ROUTES.DOWNLOAD_DATA}
              className="mobile-nav-sublink"
              onClick={handleMobileMenuClose}
            >
              Download Data
            </Link>
          </div>

          <Link
            to={ROUTES.RESULTS_COMPARISON}
            className="mobile-nav-link"
            onClick={handleMobileMenuClose}
          >
            Observed Outcomes
          </Link>

          <div className="mobile-nav-section">
            <Link
              to={ROUTES.EXPLAINERS}
              className="mobile-nav-label"
              onClick={handleMobileMenuClose}
            >
              Explainers and Other Details
            </Link>
            <a
              href={VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-nav-sublink"
              onClick={handleMobileMenuClose}
            >
              Interpreting Probabilities (the video)
            </a>
            <Link
              to={ROUTES.METHODOLOGY}
              className="mobile-nav-sublink"
              onClick={handleMobileMenuClose}
            >
              Model Methodology
            </Link>
            <Link
              to={ROUTES.PLAY_WITH_MODEL}
              className="mobile-nav-sublink"
              onClick={handleMobileMenuClose}
            >
              Model Explorer
            </Link>
            <Link
              to={ROUTES.RESOURCES}
              className="mobile-nav-sublink"
              onClick={handleMobileMenuClose}
            >
              Resources
            </Link>
          </div>

          <Link
            to={ROUTES.BLOG}
            className="mobile-nav-link"
            onClick={handleMobileMenuClose}
          >
            Blog
          </Link>

          <div className="mobile-nav-section">
            <Link
              to={ROUTES.ABOUT}
              className="mobile-nav-label"
              onClick={handleMobileMenuClose}
            >
              About
            </Link>
            <Link
              to={ROUTES.ABOUT}
              className="mobile-nav-sublink"
              onClick={handleMobileMenuClose}
            >
              About The Project
            </Link>
            <button
              type="button"
              className="mobile-nav-sublink"
              onClick={() => {
                handleContactClick();
                handleMobileMenuClose();
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

export default Header;
