import React from 'react';
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

        <div className="contact-content">
          <div className="contact-category">
            <h2>Program Questions</h2>
            <p className="contact-description">For inquiries about the Southern Pine Beetle prediction program and research</p>
            <div className="contact-list contact-list-row">
              <div className="contact-person">
                <div className="person-info">
                  <h3>Carissa Aoki</h3>
                  <p className="person-title">Research Lead</p>
                </div>
                <a href="mailto:caoki@mica.edu" className="contact-link">
                  caoki@mica.edu
                </a>
              </div>
              <div className="contact-person">
                <div className="person-info">
                  <h3>Matthew Ayres</h3>
                  <p className="person-title">Principal Investigator</p>
                </div>
                <a href="mailto:matthew.p.ayres@dartmouth.edu" className="contact-link">
                  matthew.p.ayres@dartmouth.edu
                </a>
              </div>
            </div>
          </div>

          <div className="contact-category">
            <h2>Local Forest Management</h2>
            <p className="contact-description">For questions about local forest conditions and management practices</p>
            <div className="contact-list">
              <div className="contact-person">
                <div className="person-info">
                  <h3>US Forest Service</h3>
                  <p className="person-title">Forest Management Support</p>
                </div>
                <a href="tel:+18008321355" className="contact-link">
                  (800) 832-1355
                </a>
              </div>
            </div>
          </div>

          <div className="contact-category">
            <h2>Technical Support</h2>
            <p className="contact-description">For technical issues with the prediction tool and platform</p>
            <div className="contact-list">
              <div className="contact-person">
                <div className="person-info">
                  <h3>Dartmouth DALI Lab</h3>
                  <p className="person-title">Technical Development Team</p>
                </div>
                <a href="mailto:pine-beetle@dali.dartmouth.edu" className="contact-link">
                  pine-beetle@dali.dartmouth.edu
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
