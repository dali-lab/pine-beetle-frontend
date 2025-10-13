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
                  <div className="chart-area">
                    <div className="chart-line" style={{ height: '60%', backgroundColor: '#2D5A5C' }} />
                    <div className="chart-line" style={{ height: '40%', backgroundColor: '#4A7C7E' }} />
                    <div className="chart-line" style={{ height: '25%', backgroundColor: '#6B9EA0' }} />
                    <div className="chart-line" style={{ height: '15%', backgroundColor: '#8CC0C2' }} />
                  </div>
                  <div className="chart-axis">
                    <div className="axis-label">Years</div>
                    <div className="axis-label">Beetle Count</div>
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
                  <div className="download-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7,10 12,15 17,10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>
                  <div className="file-types">
                    <div className="file-type">CSV</div>
                    <div className="file-type">Excel</div>
                    <div className="file-type">JSON</div>
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
