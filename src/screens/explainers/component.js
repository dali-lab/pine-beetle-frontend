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
                      <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4" />
                      <polyline points="9,11 12,14 15,11" />
                      <line x1="12" y1="14" x2="12" y2="2" />
                    </svg>
                  </div>
                  <div className="methodology-chart">
                    <svg className="methodology-svg" viewBox="0 0 200 120">
                      {/* Background */}
                      <rect width="200" height="120" fill="#f8f9fa" />

                      {/* Flow chart elements */}
                      <rect x="20" y="20" width="60" height="30" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2" rx="4" />
                      <text x="50" y="40" textAnchor="middle" fontSize="8" fill="#1976d2">Data Input</text>

                      <rect x="100" y="20" width="60" height="30" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2" rx="4" />
                      <text x="130" y="40" textAnchor="middle" fontSize="8" fill="#388e3c">Model</text>

                      <rect x="60" y="70" width="60" height="30" fill="#fff3e0" stroke="#f57c00" strokeWidth="2" rx="4" />
                      <text x="90" y="90" textAnchor="middle" fontSize="8" fill="#f57c00">Prediction</text>

                      {/* Arrows */}
                      <path d="M80 35 L100 35" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                      <path d="M130 50 L90 70" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />

                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                        </marker>
                      </defs>
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
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                    </svg>
                  </div>
                  <div className="interactive-controls">
                    <div className="control-slider">
                      <div className="slider-track" />
                      <div className="slider-thumb" />
                    </div>
                    <div className="control-buttons">
                      <div className="control-btn" />
                      <div className="control-btn" />
                      <div className="control-btn" />
                    </div>
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
                  <div className="resource-items">
                    <div className="resource-item">
                      <div className="resource-icon-small">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14,2 14,8 20,8" />
                        </svg>
                      </div>
                      <span>Research Papers</span>
                    </div>
                    <div className="resource-item">
                      <div className="resource-icon-small">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7,10 12,15 17,10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </div>
                      <span>Data Downloads</span>
                    </div>
                    <div className="resource-item">
                      <div className="resource-icon-small">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                        </svg>
                      </div>
                      <span>Tools & Code</span>
                    </div>
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
