import React from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../constants';

import './style.scss';

const DataScreen = () => {
  return (
    <div className="data-screen">
      <div className="data-container">
        <div className="page-header">
          <h1>Historical Data</h1>
          <p className="page-description">
            Access and explore Southern Pine Beetle historical data through various visualization and analysis tools.
            Choose from time series analysis, tabular data views, or download raw data for your research.
          </p>
        </div>

        <div className="data-thumbnails">
          <div className="thumbnail-grid">
            {/* Time Series Thumbnail */}
            <Link to={ROUTES.HISTORICAL_VIEW} className="thumbnail-card">
              <div className="thumbnail-visual">
                <div className="time-series-chart">
                  <div className="chart-title">SPB · trap⁻¹ · 14 days⁻¹</div>
                  <div className="chart-area">
                    <svg className="line-chart" viewBox="0 0 200 120">
                      {/* Grid lines */}
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="200" height="120" fill="url(#grid)" />

                      {/* Line chart data points - representing SPB data over time */}
                      <polyline
                        fill="none"
                        stroke="#e74c3c"
                        strokeWidth="2"
                        strokeDasharray="3,2"
                        points="10,80 20,75 30,70 40,65 50,60 60,55 70,50 80,45 90,40 100,35 110,30 120,25 130,20 140,25 150,30 160,35 170,40 180,45 190,50"
                      />

                      {/* Data points */}
                      <circle cx="10" cy="80" r="2" fill="#e74c3c" />
                      <circle cx="20" cy="75" r="2" fill="#e74c3c" />
                      <circle cx="30" cy="70" r="2" fill="#e74c3c" />
                      <circle cx="40" cy="65" r="2" fill="#e74c3c" />
                      <circle cx="50" cy="60" r="2" fill="#e74c3c" />
                      <circle cx="60" cy="55" r="2" fill="#e74c3c" />
                      <circle cx="70" cy="50" r="2" fill="#e74c3c" />
                      <circle cx="80" cy="45" r="2" fill="#e74c3c" />
                      <circle cx="90" cy="40" r="2" fill="#e74c3c" />
                      <circle cx="100" cy="35" r="2" fill="#e74c3c" />
                      <circle cx="110" cy="30" r="2" fill="#e74c3c" />
                      <circle cx="120" cy="25" r="2" fill="#e74c3c" />
                      <circle cx="130" cy="20" r="2" fill="#e74c3c" />
                      <circle cx="140" cy="25" r="2" fill="#e74c3c" />
                      <circle cx="150" cy="30" r="2" fill="#e74c3c" />
                      <circle cx="160" cy="35" r="2" fill="#e74c3c" />
                      <circle cx="170" cy="40" r="2" fill="#e74c3c" />
                      <circle cx="180" cy="45" r="2" fill="#e74c3c" />
                      <circle cx="190" cy="50" r="2" fill="#e74c3c" />

                      {/* Axes */}
                      <line x1="10" y1="100" x2="190" y2="100" stroke="#333" strokeWidth="1" />
                      <line x1="10" y1="10" x2="10" y2="100" stroke="#333" strokeWidth="1" />

                      {/* Axis labels */}
                      <text x="100" y="115" textAnchor="middle" fontSize="8" fill="#666">Year</text>
                      <text x="5" y="55" textAnchor="middle" fontSize="8" fill="#666" transform="rotate(-90 5 55)">Average count</text>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="thumbnail-content">
                <h3>Time Series</h3>
                <p>View a graph of Southern Pine Beetle statistics for a chosen area over time.</p>
              </div>
            </Link>

            {/* Data Table Thumbnail */}
            <Link to={ROUTES.DATA_TABLE} className="thumbnail-card">
              <div className="thumbnail-visual">
                <div className="data-table-preview">
                  <div className="table-header">
                    <div className="header-cell">Year</div>
                    <div className="header-cell">State</div>
                    <div className="header-cell">County</div>
                    <div className="header-cell">Count</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">2023</div>
                    <div className="table-cell">AL</div>
                    <div className="table-cell">Baldwin</div>
                    <div className="table-cell">3,100</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">2023</div>
                    <div className="table-cell">AL</div>
                    <div className="table-cell">Mobile</div>
                    <div className="table-cell">1,900</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell">2022</div>
                    <div className="table-cell">FL</div>
                    <div className="table-cell">Escambia</div>
                    <div className="table-cell">2,200</div>
                  </div>
                </div>
              </div>
              <div className="thumbnail-content">
                <h3>Data Tables</h3>
                <p>View the Southern Pine Beetle data in tabular format for a selected area.</p>
              </div>
            </Link>

            {/* Download Data Thumbnail */}
            <Link to={ROUTES.DOWNLOAD_DATA} className="thumbnail-card">
              <div className="thumbnail-visual">
                <div className="download-preview">
                  <div className="download-icon-data">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7,10 12,15 17,10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="thumbnail-content">
                <h3>Download Data</h3>
                <p>Download raw data files in various formats for offline analysis and research purposes.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataScreen;
