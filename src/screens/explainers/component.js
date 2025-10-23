import React from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../constants';

import './style.scss';

const ExplainersScreen = () => {
  return (
    <div className="explainers-screen">
      <div className="explainers-container">
        <div className="page-header">
          <h1>Explainer & Details</h1>
          <p className="page-description">
            Explore detailed explanations, methodologies, and interactive tools to better understand
            Southern Pine Beetle prediction models and research findings.
          </p>
        </div>

        <div className="explainers-thumbnails">
          <div className="thumbnail-grid">
            {/* Interpreting Probabilities Video Thumbnail */}
            <a
              href="https://drive.google.com/file/d/1lp0-8pCiAkaXqVclcxjjSx4RcBKGeH3M/view"
              target="_blank"
              rel="noopener noreferrer"
              className="thumbnail-card"
            >
              <div className="thumbnail-visual">
                <div className="video-preview">
                  <div className="video-icon">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                  <div className="play-overlay">
                    <div className="play-button">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="thumbnail-content">
                <h3>Interpreting Probabilities</h3>
                <p>Watch the video explanation of how to interpret Southern Pine Beetle outbreak probability predictions.</p>
              </div>
            </a>

            {/* Model Methodology Thumbnail */}
            <Link to={ROUTES.METHODOLOGY} className="thumbnail-card">
              <div className="thumbnail-visual">
                <div className="methodology-preview">
                  <div className="methodology-icon">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="thumbnail-content">
                <h3>Model Methodology</h3>
                <p>Learn about the scientific methodology behind the Southern Pine Beetle prediction model.</p>
              </div>
            </Link>

            {/* Model Explorer Thumbnail */}
            <Link to={ROUTES.PLAY_WITH_MODEL} className="thumbnail-card">
              <div className="thumbnail-visual">
                <div className="explorer-preview">
                  <div className="explorer-icon">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                      <rect x="4" y="5" width="1" height="2" rx="0.1" fill="currentColor" />
                      <rect x="12" y="11" width="1" height="2" rx="0.1" fill="currentColor" />
                      <rect x="8" y="17" width="1" height="2" rx="0.1" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="thumbnail-content">
                <h3>Model Explorer</h3>
                <p>Interact with the prediction model by adjusting parameters and exploring different scenarios.</p>
              </div>
            </Link>

            {/* Resources Thumbnail */}
            <Link to={ROUTES.RESOURCES} className="thumbnail-card">
              <div className="thumbnail-visual">
                <div className="resources-preview">
                  <div className="resources-icon">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10,9 9,9 8,9" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="thumbnail-content">
                <h3>Resources</h3>
                <p>Access research papers, datasets, code repositories, and other valuable resources.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainersScreen;
