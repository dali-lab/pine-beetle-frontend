import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import pineBeetleImage from '../../assets/icons/black-beetle-logo.png';
import { ROUTES } from '../../constants';

import './style.scss';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [historicalDataOpen, setHistoricalDataOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const navRef = useRef(null);
  const historicalDataButtonRef = useRef(null);
  const howItWorksButtonRef = useRef(null);
  const aboutButtonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [howItWorksDropdownPosition, setHowItWorksDropdownPosition] = useState({ top: 0, left: 0 });
  const [aboutDropdownPosition, setAboutDropdownPosition] = useState({ top: 0, left: 0 });

  const location = useLocation();

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setHistoricalDataOpen(false);
        setHowItWorksOpen(false);
        setAboutOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToUrl = '?scrollTo=howItWorks';

  const handleHowItWorksButtonClick = () => {
    if (location.pathname === ROUTES.HOME && location.search === scrollToUrl) {
      window.location.href = `/${scrollToUrl}`;
    } else {
      window.location.href = `/${scrollToUrl}`;
    }
  };

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
            <span className="logo-text">SPB Predict</span>
          </Link>

          <div className="desktop-nav" />

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

      {/* Navigation Bar */}
      <nav className="navigation-bar" ref={navRef}>
        <div className="nav-container">
          <div className="nav-items">
            <Link
              to={ROUTES.PREDICTIONS}
              className={`nav-item ${location.pathname === ROUTES.PREDICTIONS ? 'active' : ''}`}
            >
              Prediction Outbreak
            </Link>

            <Link
              to={ROUTES.RESULTS_COMPARISON}
              className={`nav-item ${location.pathname === ROUTES.RESULTS_COMPARISON ? 'active' : ''}`}
            >
              Result Comparison
            </Link>

            {/* Historical Data Menu */}
            <div
              className="nav-dropdown"
              ref={historicalDataButtonRef}
              onMouseEnter={() => {
                if (historicalDataButtonRef.current) {
                  const rect = historicalDataButtonRef.current.getBoundingClientRect();
                  setDropdownPosition({
                    top: rect.bottom,
                    left: rect.left,
                  });
                }
                setHowItWorksOpen(false);
                setAboutOpen(false);
                setHistoricalDataOpen(true);
              }}
            >
              <button
                type="button"
                className={`nav-item dropdown-trigger ${location.pathname === ROUTES.TRAPPING_DATA ? 'active' : ''}`}
              >
                Historical Data
                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className="dropdown-menu-historical"
                onMouseEnter={() => setHistoricalDataOpen(true)}
                onMouseLeave={() => setHistoricalDataOpen(false)}
                style={{
                  display: historicalDataOpen ? 'block' : 'none',
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                }}
              >
                <Link
                  to="/data/graphs"
                  className="dropdown-item"
                  onClick={() => setHistoricalDataOpen(false)}
                >
                  Data Graph
                </Link>
                <Link
                  to={ROUTES.TRAPPING_DATA}
                  className="dropdown-item"
                  onClick={() => setHistoricalDataOpen(false)}
                >
                  Map
                </Link>
                <Link
                  to="/data/download"
                  className="dropdown-item"
                  onClick={() => setHistoricalDataOpen(false)}
                >
                  Data Download
                </Link>
              </div>
            </div>

            {/* How does it work Menu */}
            <div
              className="nav-dropdown"
              ref={howItWorksButtonRef}
              onMouseEnter={() => {
                if (howItWorksButtonRef.current) {
                  const rect = howItWorksButtonRef.current.getBoundingClientRect();
                  setHowItWorksDropdownPosition({
                    top: rect.bottom,
                    left: rect.left,
                  });
                }
                setHistoricalDataOpen(false);
                setAboutOpen(false);
                setHowItWorksOpen(true);
              }}
            >
              <button
                type="button"
                className="nav-item dropdown-trigger"
              >
                How does it work
                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className="dropdown-menu-how-it-works"
                onMouseEnter={() => setHowItWorksOpen(true)}
                onMouseLeave={() => setHowItWorksOpen(false)}
                style={{
                  display: howItWorksOpen ? 'block' : 'none',
                  top: `${howItWorksDropdownPosition.top}px`,
                  left: `${howItWorksDropdownPosition.left}px`,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    handleHowItWorksButtonClick();
                    setHowItWorksOpen(false);
                  }}
                  className="dropdown-item"
                >
                  Methodology
                </button>
                <a
                  href="https://drive.google.com/file/d/1lp0-8pCiAkaXqVclcxjjSx4RcBKGeH3M/preview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dropdown-item"
                  onClick={() => setHowItWorksOpen(false)}
                >
                  Learn more from the video
                </a>
              </div>
            </div>

            {/* About Menu */}
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
                setHowItWorksOpen(false);
                setAboutOpen(true);
              }}
            >
              <button
                type="button"
                className="nav-item dropdown-trigger"
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
