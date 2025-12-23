import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

import daliLogo from '../../assets/icons/dali_dark.png';
import usfsLogo from '../../assets/images/logo_USFS.svg';
import lunarLogicLogo from '../../assets/icons/Lunar-Logic-White-Logo.svg';
import { ROUTES } from '../../constants';

const Footer = () => (
  <div id="footer">
    <div id="footer-container">
      {/* Left: Company Branding */}
      <div id="footer-branding">
        <div id="footer-brand-text">
          <h3 id="footer-brand-name">SPB Predictions</h3>
          <p id="footer-copyright">© 2025 All rights reserved</p>
        </div>
      </div>

      {/* Middle: Navigation Links */}
      <div id="footer-nav">
        <Link to={ROUTES.ABOUT} className="footer-nav-link">About</Link>
        <Link to={ROUTES.RESOURCES} className="footer-nav-link">Resources</Link>
        <Link to={ROUTES.CONTACT} className="footer-nav-link">Contact</Link>
      </div>

      {/* Right: Partners */}
      <div id="footer-partners">
        <p id="footer-partners-label">PARTNERS</p>
        <div id="footer-partners-logos">
          <a
            href="https://www.fs.usda.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-partner-logo"
          >
            <img src={usfsLogo} alt="USFS Logo" />
          </a>
          <a
            href="https://lunarlogic.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-partner-logo"
          >
            <img src={lunarLogicLogo} alt="LunarLogic Logo" />
          </a>
          <a
            href="http://dali.dartmouth.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-partner-logo"
          >
            <img src={daliLogo} alt="DALI Lab Logo" />
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
