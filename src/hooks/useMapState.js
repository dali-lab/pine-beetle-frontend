import { useState } from 'react';

/**
 * Custom hook to manage map-related state
 * @returns {Object} Map state and setters
 */
const useMapState = () => {
  const [map, setMap] = useState(null);
  const [initialFill, setInitialFill] = useState(false);
  const [hover, setHover] = useState(null);
  const [isDownloadingMap, setIsDownloadingMap] = useState(false);
  const [mapClickCallback, setMapClickCallback] = useState(null);
  const [mapHoverCallback, setMapHoverCallback] = useState(null);
  const [mapStateClickCallback, setMapStateClickCallback] = useState(null);
  const [mapLayerMouseLeaveCallback, setMapLayerMouseLeaveCallback] = useState(null);

  return {
    map,
    setMap,
    initialFill,
    setInitialFill,
    hover,
    setHover,
    isDownloadingMap,
    setIsDownloadingMap,
    mapClickCallback,
    setMapClickCallback,
    mapHoverCallback,
    setMapHoverCallback,
    mapStateClickCallback,
    setMapStateClickCallback,
    mapLayerMouseLeaveCallback,
    setMapLayerMouseLeaveCallback,
  };
};

export default useMapState;
