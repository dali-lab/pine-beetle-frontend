import React from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../constants';

import './style.scss';

const VideoPreview = () => {
  return (
    <div className="preview-visual video-preview-visual">
      <div className="video-overlay" />
      <div className="play-button-container">
        <div className="play-button">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" />
      </div>
    </div>
  );
};

const DiagramPreview = () => {
  return (
    <div className="preview-visual diagram-preview-visual">
      <div className="flowchart">
        <div className="flow-box input-box">INPUT</div>
        <div className="flow-connector" />
        <div className="flow-row">
          <div className="flow-box process-box">PROCESS</div>
          <div className="flow-box process-box">ANALYZE</div>
        </div>
        <div className="flow-connector" />
        <div className="flow-box output-box">OUTPUT</div>
      </div>
    </div>
  );
};

const ToolPreview = () => {
  return (
    <div className="preview-visual tool-preview-visual">
      <div className="tool-interface">
        <div className="tool-controls">
          <div className="control-line" />
          <div className="control-line short" />
          <div className="control-slider primary" />
          <div className="control-slider secondary" />
        </div>
        <div className="tool-visualization">
          <div className="viz-pattern" />
        </div>
      </div>
    </div>
  );
};

const DocPreview = () => {
  return (
    <div className="preview-visual doc-preview-visual">
      <div className="documents-stack">
        <div className="document doc-1">
          <div className="doc-line" />
          <div className="doc-line" />
          <div className="doc-line" />
          <div className="doc-line short" />
          <div className="doc-spacer" />
          <div className="doc-line" />
          <div className="doc-line short" />
        </div>
        <div className="document doc-2" />
        <div className="document doc-3" />
      </div>
    </div>
  );
};

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
                <VideoPreview />
              </div>
              <div className="thumbnail-content">
                <h3>Interpreting Probabilities</h3>
                <p>Watch the video explanation of how to interpret Southern Pine Beetle outbreak probability predictions.</p>
                <div className="card-action">
                  Watch Video
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12,5 19,12 12,19" />
                  </svg>
                </div>
              </div>
            </a>

            {/* Model Methodology Thumbnail */}
            <Link to={ROUTES.METHODOLOGY} className="thumbnail-card">
              <div className="thumbnail-visual">
                <DiagramPreview />
              </div>
              <div className="thumbnail-content">
                <h3>Model Methodology</h3>
                <p>Learn about the scientific methodology behind the Southern Pine Beetle prediction model.</p>
                <div className="card-action">
                  View Methodology
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12,5 19,12 12,19" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Model Explorer Thumbnail */}
            <Link to={ROUTES.PLAY_WITH_MODEL} className="thumbnail-card">
              <div className="thumbnail-visual">
                <ToolPreview />
              </div>
              <div className="thumbnail-content">
                <h3>Model Explorer</h3>
                <p>Interact with the prediction model by adjusting parameters and exploring different scenarios.</p>
                <div className="card-action">
                  Launch Explorer
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12,5 19,12 12,19" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Resources Thumbnail */}
            <div className="resources-card-wrapper">
              <Link to={ROUTES.RESOURCES} className="thumbnail-card">
                <div className="thumbnail-visual">
                  <DocPreview />
                </div>
                <div className="thumbnail-content">
                  <h3>Resources</h3>
                  <p>Access research papers, datasets, code repositories, and other valuable resources.</p>
                  <div className="card-action">
                    Browse Files
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12,5 19,12 12,19" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainersScreen;
