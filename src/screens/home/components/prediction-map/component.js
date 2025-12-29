/*
 * DEV NOTE: Fixed map coloring on navigation - force recolor on mount
 */
import mapboxgl from 'mapbox-gl';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Map } from '../../../../components';
import InfoTextBox from '../../../../components/info-text-box';
import MapControls from '../../../../components/map-controls/component';
import TogglesOverlay from '../../../../components/map/components';
import {
  DATA_MODES,
  MAP_INIT_CONSTANTS,
  MAP_TITLES,
  VECTOR_LAYER,
} from '../../../../constants';
import {
  useMapCallbacks, useMapState, useRangerDistricts,
} from '../../../../hooks';
import {
  createHoverCallback,
  createMapClickCallback,
  downloadMap,
  formatLocationForMapbox,
  generateMap,
  getFillColor,
  getMapboxRDNameFormat,
  getSourceLayer,
  mapboxHoverStyle,
  zoomToSelectedState,
} from '../../../../utils';
import { logError, logWarning } from '../../../../utils/logger';
import { isInvalidNumber } from '../../../../utils/map';
import {
  addDefaultExpressions,
  addLocationToExpressions,
  addMapLayer,
  createBaseExpressions,
  removeVectorLayer,
  waitForStyleLoad,
} from '../../../../utils/map-coloring';
import { isMapRemoved as checkMapRemoved, markMapAsRemoved as markMapRemoved } from '../../../../utils/map-instance-tracker';
import PredictionDetails from '../prediction-details';
import {
  colors,
  thresholds,
} from './constants';
import './style.scss';

const PredictionMap = (props) => {
  const {
    availableStates,
    availableSublocations,
    availableYears,
    county,
    data,
    dataMode,
    rangerDistrict,
    selectedState,
    setCounty,
    setCountyFilter,
    setDataMode,
    setPredictionYear,
    setRangerDistrict,
    setRangerDistrictFilter,
    setState,
    setPredictionModal,
    clearAllSelections,
    year,
    predictionModal,
  } = props;

  const {
    map,
    setMap,
    hover: predictionHover,
    setHover: setPredictionHover,
    isDownloadingMap,
    setIsDownloadingMap,
  } = useMapState();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const hasColoredRef = useRef(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const allRangerDistricts = useRangerDistricts(dataMode);

  const colorPredictionsTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  const styleRetryCountRef = useRef(0);

  // Cleanup effect for refs and timeouts
  useEffect(() => {
    isMountedRef.current = true;
    hasColoredRef.current = false;

    return () => {
      isMountedRef.current = false;
      if (colorPredictionsTimeoutRef.current) {
        clearTimeout(colorPredictionsTimeoutRef.current);
        colorPredictionsTimeoutRef.current = null;
      }
    };
  }, []);

  const createMapHoverCallback = useCallback((predictions, rangerDistricts, mode, state, availStates) => {
    const callback = (hoverState, location, x, y) => {
      const pred = predictions.find((p) => {
        return (mode === DATA_MODES.RANGER_DISTRICT || (p.state === hoverState && p.state === state) || (!state && availStates.includes(hoverState)))
              && ((p.county === location && mode === DATA_MODES.COUNTY && p.state === hoverState) || (p.rangerDistrict === location && mode === DATA_MODES.RANGER_DISTRICT));
      });

      if (pred && x && y) {
        const {
          county: countyName,
          probSpotsGT0: probAny,
          probSpotsGT50: probOutbreak,
        } = pred;

        setPredictionHover((
          <div id="prediction-hover" style={mapboxHoverStyle(x, y)}>
            <h3>{dataMode === DATA_MODES.COUNTY ? `${countyName} County` : `${getMapboxRDNameFormat(location).slice(0, -3)} Ranger District`}</h3>
            <p>Probability of any spots: {isInvalidNumber(probAny) ? 'null' : (probAny * 100).toFixed(1)}%</p>
            <p>Probability of an outbreak: {isInvalidNumber(probOutbreak) ? 'null' : (probOutbreak * 100).toFixed(1)}%</p>
          </div>
        ));
      } else {
        setPredictionHover(null);
      }
    };

    return createHoverCallback(map, rangerDistricts, dataMode, callback, isMobile);
  }, [map, dataMode, isMobile, setPredictionHover]);

  const colorPredictions = useCallback((predictions, forceRecolor = false) => {
    if (!map) return false;

    if (!waitForStyleLoad(map, colorPredictions, [predictions, forceRecolor], colorPredictionsTimeoutRef, isMountedRef, styleRetryCountRef)) {
      return false;
    }

    removeVectorLayer(map);

    const { fillExpression, strokeExpression } = createBaseExpressions(dataMode);

    const filteredPredictions = predictions.filter((prediction) => {
      if (dataMode === DATA_MODES.COUNTY) {
        if (county && county.length > 0) {
          return county.includes(prediction.county);
        }
      } else if (rangerDistrict && rangerDistrict.length > 0) {
        return rangerDistrict.includes(prediction.rangerDistrict);
      }
      return true;
    });

    filteredPredictions.forEach((prediction) => {
      const {
        county: countyName,
        probSpotsGT50: fillProb,
        rangerDistrict: rangerDistrictName,
        state,
      } = prediction;
      const { color } = getFillColor(fillProb);

      const locationName = formatLocationForMapbox(dataMode, {
        county: countyName,
        rangerDistrict: rangerDistrictName,
        state,
      });

      if (locationName) {
        const names = Array.isArray(locationName) ? locationName : [locationName];
        const validNames = names.filter((str) => !!str);
        if (validNames.length > 0) {
          addLocationToExpressions(fillExpression, strokeExpression, validNames, color);
        }
      }
    });

    addDefaultExpressions(fillExpression, strokeExpression);

    addMapLayer(map, fillExpression, strokeExpression, getSourceLayer(dataMode), dataMode);

    return true;
  }, [map, dataMode, county, rangerDistrict]);

  const mapInitializedRef = useRef(false);
  const lastDataModeRef = useRef(dataMode);
  const initTimeoutRef = useRef(null);

  // Reset refs on mount - fixes browser back/forward navigation
  useEffect(() => {
    mapInitializedRef.current = false;
  }, []);

  useEffect(() => {
    const shouldRegenerate = !map || lastDataModeRef.current !== dataMode;

    if (!shouldRegenerate && mapInitializedRef.current) {
      return;
    }

    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = null;
    }

    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

    const currentMap = map;

    initTimeoutRef.current = setTimeout(() => {
      generateMap({
        forceRegenerate: true,
        map: currentMap,
        dataMode,
        setMap,
      });
      mapInitializedRef.current = true;
      lastDataModeRef.current = dataMode;
      initTimeoutRef.current = null;
    }, MAP_INIT_CONSTANTS.INIT_DELAY);

    // eslint-disable-next-line consistent-return
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
      if (map && typeof map.remove === 'function' && map.getContainer && !checkMapRemoved(map)) {
        try {
          const container = map.getContainer();
          if (container && container.parentNode) {
            markMapRemoved(map);
            map.remove();
          }
        } catch (error) {
          if (map) {
            markMapRemoved(map);
          }
          logError('Error cleaning up map', error, { component: 'PredictionMap' });
        }
      }
      mapInitializedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataMode]);

  useEffect(() => {
    if (!map || data.length === 0 || year.toString().length !== 4) {
      return undefined;
    }

    const attemptColoring = () => {
      if (map.isStyleLoaded && map.isStyleLoaded()) {
        const didColor = colorPredictions(data, true);
        if (didColor) {
          hasColoredRef.current = true;
          zoomToSelectedState(selectedState, map);
        }
      } else {
        map.once('styledata', () => {
          const didColor = colorPredictions(data, true);
          if (didColor) {
            hasColoredRef.current = true;
            zoomToSelectedState(selectedState, map);
          }
        });
      }
    };

    const timer = setTimeout(attemptColoring, 50);
    return () => {
      clearTimeout(timer);
    };
  }, [map, data, year, selectedState, county, rangerDistrict, colorPredictions]);

  const hoverCallback = useMemo(() => {
    if (!map || !data) return null;
    return createMapHoverCallback(data, allRangerDistricts, dataMode, selectedState, availableStates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, data, allRangerDistricts, dataMode, selectedState, availableStates, createMapHoverCallback]);

  const clickCallback = useMemo(() => {
    if (!map || !availableStates || !availableSublocations) return null;
    return createMapClickCallback({
      states: availableStates,
      sublocations: availableSublocations,
      currentState: selectedState,
      data,
      dataMode,
      county: props.county,
      setCounty,
      rangerDistrict: props.rangerDistrict,
      setRangerDistrict,
      setPredictionModal,
      isMobile,
    });
  }, [map, availableStates, availableSublocations, selectedState, data, dataMode, props.county, props.rangerDistrict, setCounty, setRangerDistrict, setPredictionModal, isMobile]);

  const stateClickCallback = useCallback((e) => {
    const { abbrev } = e?.features[0]?.properties || {};
    if (abbrev && selectedState !== abbrev && availableStates.includes(abbrev)) {
      setState(abbrev);
    }
  }, [selectedState, availableStates, setState]);

  const mouseLeaveCallback = useCallback(() => {
    setPredictionHover(null);
  }, [setPredictionHover]);

  useMapCallbacks(
    map,
    clickCallback,
    hoverCallback,
    stateClickCallback,
    mouseLeaveCallback,
    [availableStates, availableSublocations, selectedState, data, dataMode, allRangerDistricts, isMobile]
  );

  useEffect(() => {
    if (data.length === 0 && map && !checkMapRemoved(map) && map.isStyleLoaded && map.isStyleLoaded() && typeof map.getLayer === 'function') {
      try {
        if (map.getLayer(VECTOR_LAYER)) {
          map.removeLayer(VECTOR_LAYER);
        }
      } catch (error) {
        logWarning('Error removing layer', error, { component: 'PredictionMap' });
      }
    }
  }, [data, map]);

  const getRiskLevel = (index) => {
    const riskLevels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High', 'Extreme'];
    return riskLevels[index] || 'Unknown';
  };

  const legendItems = thresholds.map((threshold, index) => ({
    color: colors[index],
    label: `${threshold} (${getRiskLevel(index)})`,
  }));

  return (
    <div className="container flex-item-left" id="map-container">
      <TogglesOverlay dataMode={dataMode} setDataMode={setDataMode} />
      <Map
        hover={predictionHover}
        downloadCallback={() => downloadMap(
          map,
          year,
          isDownloadingMap,
          setIsDownloadingMap,
          selectedState,
          MAP_TITLES.PREDICTION,
          { titleDetails: { selectedState, period: year }, thresholds, colors }
        )}
        isDownloadingMap={isDownloadingMap}
      />
      <InfoTextBox />
      <MapControls
        availableStates={availableStates}
        availableYears={availableYears || []}
        availableSublocations={availableSublocations}
        county={county}
        dataMode={dataMode}
        predictionYear={year}
        rangerDistrict={rangerDistrict}
        selectedState={selectedState}
        setCounty={setCountyFilter}
        setPredictionYear={setPredictionYear}
        setRangerDistrict={setRangerDistrictFilter}
        setState={setState}
        clearAllSelections={clearAllSelections}
        legendItems={legendItems}
        legendTitle="Outbreak Probability (%)"
        downloadCallback={() => downloadMap(
          map,
          year,
          isDownloadingMap,
          setIsDownloadingMap,
          selectedState,
          MAP_TITLES.PREDICTION,
          { titleDetails: { selectedState, period: year }, thresholds, colors }
        )}
        isDownloadingMap={isDownloadingMap}
      />
      {predictionModal && data.length === 1 && (
        <PredictionDetails />
      )}
    </div>
  );
};

export default PredictionMap;
