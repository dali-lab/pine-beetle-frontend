import React from 'react';

import ThumbnailCard from '../../components/thumbnail-card';
import { ROUTES } from '../../constants';
import {
  TreeDensityPreview,
  FragmentationPreview,
  MinWinterTempPreview,
} from './components';

import './style.scss';

const MAPS_CARDS = [
  {
    to: ROUTES.MAPS_TREE_DENSITY,
    visual: <TreeDensityPreview />,
    title: 'Tree Density',
    description: 'View tree density distribution across the southeast United States.',
    actionText: 'View Map',
  },
  {
    to: ROUTES.MAPS_FRAGMENTATION,
    visual: <FragmentationPreview />,
    title: 'Fragmentation',
    description: 'Explore forest fragmentation patterns in the region.',
    actionText: 'View Map',
  },
  {
    to: ROUTES.MAPS_MIN_WINTER_TEMP,
    visual: <MinWinterTempPreview />,
    title: 'Minimum Winter Temperature',
    description: 'View minimum winter temperature data over time with animated time series.',
    actionText: 'View Map',
  },
];

const MapsScreen = () => {
  return (
    <div className="maps-screen">
      <div className="maps-container">
        <div className="page-header">
          <h1>Maps</h1>
        </div>

        <div className="maps-thumbnails">
          <div className="thumbnail-grid">
            {MAPS_CARDS.map((card) => (
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

export default MapsScreen;
