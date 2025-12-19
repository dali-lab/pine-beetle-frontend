import React from 'react';

import ThumbnailCard from '../../components/thumbnail-card';
import { ROUTES } from '../../constants';
import { DataTablePreview, DownloadPreview, TimeSeriesPreview } from './components';

import './style.scss';

const DATA_CARDS = [
  {
    to: ROUTES.TIME_SERIES,
    visual: <TimeSeriesPreview />,
    title: 'Time Series',
    description: 'View a graph of Southern Pine Beetle statistics for a chosen area over time.',
    actionText: 'View Chart',
  },
  {
    to: ROUTES.DATA_TABLE,
    visual: <DataTablePreview />,
    title: 'Data Tables',
    description: 'View the Southern Pine Beetle data in tabular format for a selected area.',
    actionText: 'View Table',
  },
  {
    to: ROUTES.DOWNLOAD_DATA,
    visual: <DownloadPreview />,
    title: 'Download Data',
    description: 'Download raw data files in various formats for offline analysis and research purposes.',
    actionText: 'Browse Downloads',
  },
];

const DataScreen = () => {
  return (
    <div className="data-screen">
      <div className="data-container">
        <div className="page-header">
          <h1>Data</h1>
        </div>

        <div className="data-thumbnails">
          <div className="thumbnail-grid">
            {DATA_CARDS.map((card) => (
              <ThumbnailCard
                key={card.to}
                to={card.to}
                visual={card.visual}
                title={card.title}
                description={card.description}
                actionText={card.actionText}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataScreen;
