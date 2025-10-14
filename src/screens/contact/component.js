import React from 'react';
import backgroundBeetleImage from '../../assets/icons/background-beetle-color.png';
import './style.scss';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="page-header">
          <h1>Contact Information</h1>
          <p className="page-description">
            Get in touch with our team for questions about the Southern Pine Beetle prediction program, local forest management, or technical support.
          </p>
        </div>

        <div className="contact-sections">
          <div className="contact-section">
            <h2>Questions about the program</h2>
            <div className="contact-items-container">
              <div className="contact-item">
                <strong>Carissa Aoki:</strong>
                <a href="mailto:caoki@mica.edu">caoki@mica.edu</a>
              </div>
              <div className="contact-item">
                <strong>Matthew Ayres:</strong>
                <a href="mailto:matthew.p.ayres@dartmouth.edu">matthew.p.ayres@dartmouth.edu</a>
              </div>
            </div>
          </div>

          <div className="contact-section-with-beetle">
            <div className="contact-section">
              <h2>Questions about local forests</h2>
              <div className="contact-items-container">
                <div className="contact-item">
                  <strong>US Forest Service:</strong>
                  <a href="tel:+18008321355">(800) 832-1355</a>
                </div>
              </div>
            </div>
            <div className="beetle-icon-standalone">
              <img src={backgroundBeetleImage} alt="Pine Beetle" />
            </div>
          </div>
        </div>

        <div className="contact-sections">
          <div className="contact-section">
            <h2>Questions about the tool</h2>
            <div className="contact-items-container">
              <div className="contact-item">
                <strong>Dartmouth DALI Lab:</strong>
                <a href="mailto:pine-beetle@dali.dartmouth.edu">pine-beetle@dali.dartmouth.edu</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
