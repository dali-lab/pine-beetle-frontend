import React from 'react';
import { Link } from 'react-router-dom';

import ArrowRightIcon from './ArrowRightIcon';

const ThumbnailCard = ({
  to,
  href,
  visual,
  title,
  description,
  actionText,
}) => {
  const content = (
    <>
      <div className="thumbnail-visual">
        {visual}
      </div>
      <div className="thumbnail-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="card-action">
          {actionText}
          <ArrowRightIcon />
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="thumbnail-card"
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={to} className="thumbnail-card">
      {content}
    </Link>
  );
};

export default ThumbnailCard;
