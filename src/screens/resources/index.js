/* eslint-disable max-len */
import React from 'react';
import { Link } from 'react-router-dom';

import {
  RESOURCE_ROUTES,
  VIDEO_URL,
} from '../../constants';

import './style.scss';

const Resources = (_props) => {
  return (
    <div className="resources-page">
      <div className="resources-container">
        <div className="page-header">
          <h1>Supporting Resources</h1>
          <p className="page-description">
            Access research papers, datasets, code, and other resources related to the Southern Pine Beetle prediction system and forest management.
          </p>
        </div>

        <div className="resources-content">
          <section className="resources-section">
            <h2>System Documentation</h2>
            <p className="section-intro">
              Learn about the reliability, utility, and technical implementation of the Southern Pine Beetle prediction system.
            </p>

            <div className="resource-grid">
              <div className="resource-card">
                <div className="resource-header">
                  <h3>System Overview Video</h3>
                  <span className="resource-type">Video</span>
                </div>
                <p className="resource-description">
                  A comprehensive explainer video covering the Southern Pine Beetle prediction system, its methodology, and applications.
                </p>
                <div className="resource-actions">
                  <a href={VIDEO_URL} target="_blank" rel="noopener noreferrer" className="resource-link">
                    Watch Video
                  </a>
                </div>
              </div>

              <div className="resource-card">
                <div className="resource-header">
                  <h3>Utility and Reliability Report</h3>
                  <span className="resource-type">PDF</span>
                </div>
                <p className="resource-description">
                  Comprehensive analysis of the prediction system&apos;s utility and reliability based on historical data and validation studies.
                </p>
                <div className="resource-actions">
                  <Link to={RESOURCE_ROUTES.UTILITY_RELIABILITY} className="resource-link">
                    Download PDF
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="resources-section">
            <h2>Research Data</h2>
            <p className="section-intro">
              Access the datasets used in the Southern Pine Beetle prediction system, including historical trapping data and model predictions.
            </p>

            <div className="resource-grid">
              <div className="resource-card">
                <div className="resource-header">
                  <h3>Annual Data (1988-2021)</h3>
                  <span className="resource-type">ZIP</span>
                </div>
                <p className="resource-description">
                  Annual trapping data, spot data, and model predictions for each participating county, parish, or federal parcel from 1988-2021.
                </p>
                <div className="resource-details">
                  <div className="detail-item">
                    <strong>Format:</strong> CSV files in ZIP archive
                  </div>
                  <div className="detail-item">
                    <strong>Coverage:</strong> Southern United States
                  </div>
                  <div className="detail-item">
                    <strong>Update:</strong> Version 1 (2022)
                  </div>
                </div>
                <div className="resource-actions">
                  <Link to={RESOURCE_ROUTES.ANNUAL} className="resource-link">
                    Download Dataset
                  </Link>
                </div>
              </div>

              <div className="resource-card">
                <div className="resource-header">
                  <h3>Weekly Data (1987-2011)</h3>
                  <span className="resource-type">ZIP</span>
                </div>
                <p className="resource-description">
                  Unreduced weekly trapping data for each participating county, parish, or federal parcel from 1987-2011.
                </p>
                <div className="resource-details">
                  <div className="detail-item">
                    <strong>Format:</strong> CSV files in ZIP archive
                  </div>
                  <div className="detail-item">
                    <strong>Coverage:</strong> Southern United States
                  </div>
                  <div className="detail-item">
                    <strong>Update:</strong> Version 1 (2022)
                  </div>
                </div>
                <div className="resource-actions">
                  <Link to={RESOURCE_ROUTES.WEEKLY_OLD} className="resource-link">
                    Download Dataset
                  </Link>
                </div>
              </div>

              <div className="resource-card">
                <div className="resource-header">
                  <h3>Weekly Data (2011-2017)</h3>
                  <span className="resource-type">ZIP</span>
                </div>
                <p className="resource-description">
                  Unreduced weekly trapping data for each participating county, parish, or federal parcel from 2011-2017.
                </p>
                <div className="resource-details">
                  <div className="detail-item">
                    <strong>Format:</strong> CSV files in ZIP archive
                  </div>
                  <div className="detail-item">
                    <strong>Coverage:</strong> Southern United States
                  </div>
                  <div className="detail-item">
                    <strong>Update:</strong> Version 1 (2022)
                  </div>
                </div>
                <div className="resource-actions">
                  <Link to={RESOURCE_ROUTES.WEEKLY} className="resource-link">
                    Download Dataset
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="resources-section">
            <h2>Technical Resources</h2>
            <p className="section-intro">
              Access the technical implementation details, code, and research papers that form the foundation of the prediction system.
            </p>

            <div className="resource-grid">
              <div className="resource-card">
                <div className="resource-header">
                  <h3>Model Code & Documentation</h3>
                  <span className="resource-type">ZIP</span>
                </div>
                <p className="resource-description">
                  Complete technical description with code of the model employed by spbpredict.com, including implementation details and usage instructions.
                </p>
                <div className="resource-details">
                  <div className="detail-item">
                    <strong>Language:</strong> R/Python
                  </div>
                  <div className="detail-item">
                    <strong>Documentation:</strong> Included
                  </div>
                  <div className="detail-item">
                    <strong>Update:</strong> Version 1 (2022)
                  </div>
                </div>
                <div className="resource-actions">
                  <Link to={RESOURCE_ROUTES.CODE} className="resource-link">
                    Download Code
                  </Link>
                </div>
              </div>

              <div className="resource-card">
                <div className="resource-header">
                  <h3>Research Dissertation</h3>
                  <span className="resource-type">PDF</span>
                </div>
                <p className="resource-description">
                  Doctoral dissertation by Carissa Aoki (2017) that developed the initial version of the zero-inflated Poisson model used in the prediction system.
                </p>
                <div className="resource-details">
                  <div className="detail-item">
                    <strong>Author:</strong> Carissa Aoki
                  </div>
                  <div className="detail-item">
                    <strong>Institution:</strong> Dartmouth College
                  </div>
                  <div className="detail-item">
                    <strong>Year:</strong> 2017
                  </div>
                </div>
                <div className="resource-actions">
                  <Link to={RESOURCE_ROUTES.DISSERTATION} className="resource-link">
                    Download PDF
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="resources-section">
            <h2>Additional References</h2>
            <p className="section-intro">
              Key research papers and publications on Southern Pine Beetle population dynamics and forest management.
            </p>

            <div className="reference-list">
              <div className="reference-item">
                <h4>Population Dynamics Research</h4>
                <p>
                  Aoki, C. F. 2017. Forest risk and irruptive insect pests: ecology for management in changing times.
                  Dissertation. Dartmouth College, Hanover, NH USA.
                  <em>(Chapter 3 developed the initial version of the zero-inflated Poisson model employed by spbpredict.com, version 1.)</em>
                </p>
              </div>
            </div>
          </section>

          <section className="resources-section">
            <h2>Data Usage Guidelines</h2>
            <div className="guidelines-content">
              <p>
                When using these resources, please cite the appropriate publications and acknowledge the collaborative
                effort of the Southern Pine Beetle Monitoring and Prediction Team. For questions about data usage
                or collaboration opportunities, please contact the research team.
              </p>
              <div className="citation-example">
                <h4>Suggested Citation Format:</h4>
                <p>
                  <em>
                    SPB Monitoring and Prediction Team. [Year]. [Resource Title]. [Resource Type].
                    Available at: [URL]. Accessed: [Date].
                  </em>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Resources;
