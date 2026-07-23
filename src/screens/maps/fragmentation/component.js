import React from 'react';

import { ArcgisRasterMap } from '../../../components';
import { ARCGIS_MAP_ITEMS } from '../../../constants';

import './style.scss';

const FragmentationMap = () => {
  return (
    <div className="map-page">
      <div className="map-container">
        <div className="page-header">
          <h1>Fragmentation</h1>
        </div>
        <div className="map-embed-container">
          <ArcgisRasterMap itemId={ARCGIS_MAP_ITEMS.FRAGMENTATION} title="Fragmentation Map" />
        </div>
      </div>
    </div>
  );
};

export default FragmentationMap;
