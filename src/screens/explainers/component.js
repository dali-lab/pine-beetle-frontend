import React from 'react';

import { ROUTES } from '../../constants';
import ThumbnailCard from '../../components/thumbnail-card';
import {
  VideoPreview, DiagramPreview, ToolPreview, DocPreview,
} from './components';

import './style.scss';

const EXPLAINER_CARDS = [
  {
    href: 'https://drive.google.com/file/d/1lp0-8pCiAkaXqVclcxjjSx4RcBKGeH3M/view',
    visual: <VideoPreview />,
    title: 'Interpreting Probabilities',
    description: 'Watch the video explanation of how to interpret Southern Pine Beetle outbreak probability predictions.',
    actionText: 'Watch Video',
    id: 'interpreting-probabilities',
  },
  {
    to: ROUTES.METHODOLOGY,
    visual: <DiagramPreview />,
    title: 'Model Methodology',
    description: 'Learn about the scientific methodology behind the Southern Pine Beetle prediction model.',
    actionText: 'View Methodology',
    id: 'model-methodology',
  },
  {
    to: ROUTES.PLAY_WITH_MODEL,
    visual: <ToolPreview />,
    title: 'Model Explorer',
    description: 'Interact with the prediction model by adjusting parameters and exploring different scenarios.',
    actionText: 'Launch Explorer',
    id: 'model-explorer',
  },
  {
    to: ROUTES.RESOURCES,
    visual: <DocPreview />,
    title: 'Resources',
    description: 'Access research papers, datasets, code repositories, and other valuable resources.',
    actionText: 'Browse Files',
    wrapperClassName: 'resources-card-wrapper',
    id: 'resources',
  },
];

const ExplainersScreen = () => {
  return (
    <div className="explainers-screen">
      <div className="explainers-container">
        <div className="page-header">
          <h1>Explainer & Details</h1>
        </div>

        <div className="explainers-thumbnails">
          <div className="thumbnail-grid">
            {EXPLAINER_CARDS.map((card) => {
              const cardElement = (
                <ThumbnailCard
                  key={card.id}
                  to={card.to}
                  href={card.href}
                  visual={card.visual}
                  title={card.title}
                  description={card.description}
                  actionText={card.actionText}
                />
              );

              return card.wrapperClassName ? (
                <div key={card.id} className={card.wrapperClassName}>
                  {cardElement}
                </div>
              ) : (
                cardElement
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainersScreen;
