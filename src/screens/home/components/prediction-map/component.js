/*
 * DEV NOTE: Refactored to use composition pattern with shared hooks and utilities.
 * All functionality preserved including mobile detection and prediction modal.
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
import MapControls from '../../../../components/map-controls/component';
import TogglesOverlay from '../../../../components/map/components';
import {
  DATA_MODES,
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
import { isInvalidNumber } from '../../../../utils/map';
import {
  addDefaultExpressions,
  addLocationToExpressions,
  addMapLayer,
  createBaseExpressions,
  removeVectorLayer,
  waitForStyleLoad,
} from '../../../../utils/map-coloring';
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
    setDataMode,
    setPredictionYear,
    setRangerDistrict,
    setState,
    setPredictionModal,
    clearAllSelections,
    year,
    predictionModal,
  } = props;

  // Use shared hooks for state management
  const {
    map,
    setMap,
    initialFill,
    setInitialFill,
    hover: predictionHover,
    setHover: setPredictionHover,
    isDownloadingMap,
    setIsDownloadingMap,
  } = useMapState();

  // Mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  // Fetch ranger districts when in RD mode
  const allRangerDistricts = useRangerDistricts(dataMode);

  // Refs for cleanup and race condition prevention
  const colorPredictionsTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (colorPredictionsTimeoutRef.current) {
        clearTimeout(colorPredictionsTimeoutRef.current);
        colorPredictionsTimeoutRef.current = null;
      }
    };
  }, []);

  // Create hover callback
  const createMapHoverCallback = useCallback((predictions, rangerDistricts, mode, state, availStates) => {
    const callback = (hoverState, location, x, y) => {
      const pred = predictions.find((p) => {
        // either ranger district mode or have a matching state
        return (mode === DATA_MODES.RANGER_DISTRICT || (p.state === hoverState && p.state === state) || (!state && availStates.includes(hoverState)))
              // and sublocation matches
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

  // Color predictions function using shared utilities
  const colorPredictions = useCallback((predictions) => {
    if (!map) return;

    // Wait for style to load with proper cleanup
    if (!waitForStyleLoad(map, colorPredictions, [predictions], colorPredictionsTimeoutRef, isMountedRef)) {
      return;
    }

    // Remove existing layer
    removeVectorLayer(map);

    // Create base expressions
    const { fillExpression, strokeExpression } = createBaseExpressions();

    predictions.forEach((prediction) => {
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

      // Handle both string (county) and array (RD with variants)
      if (locationName) {
        const names = Array.isArray(locationName) ? locationName : [locationName];
        const validNames = names.filter((str) => !!str);
        if (validNames.length > 0) {
          addLocationToExpressions(fillExpression, strokeExpression, validNames, color);
        }
      }
    });

    // Add default expressions
    addDefaultExpressions(fillExpression, strokeExpression);

    // Add layer to map
    addMapLayer(map, fillExpression, strokeExpression, getSourceLayer(dataMode));
  }, [map, dataMode]);

  const mapInitializedRef = useRef(false);
  const lastDataModeRef = useRef(dataMode);
  const initTimeoutRef = useRef(null);

  const latestValuesRef = useRef({
    availableStates,
    availableSublocations,
    selectedState,
    data,
    allRangerDistricts,
    isMobile,
    county: props.county,
    rangerDistrict: props.rangerDistrict,
  });

  useEffect(() => {
    latestValuesRef.current = {
      availableStates,
      availableSublocations,
      selectedState,
      data,
      allRangerDistricts,
      isMobile,
      county: props.county,
      rangerDistrict: props.rangerDistrict,
    };
  });

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

    const latest = latestValuesRef.current;
    const clickCallback = createMapClickCallback(
      latest.availableStates,
      latest.availableSublocations,
      latest.selectedState,
      latest.data,
      dataMode,
      latest.county,
      setCounty,
      latest.rangerDistrict,
      setRangerDistrict,
      setPredictionModal,
      latest.isMobile,
    );
    const hoverCallback = createMapHoverCallback(
      latest.data,
      latest.allRangerDistricts,
      dataMode,
      latest.selectedState,
      latest.availableStates,
    );

    const currentMap = map;

    initTimeoutRef.current = setTimeout(() => {
      generateMap(
        true,
        currentMap,
        thresholds,
        colors,
        () => {},
        dataMode,
        clickCallback,
        () => {},
        hoverCallback,
        () => {},
        setMap,
      );
      mapInitializedRef.current = true;
      lastDataModeRef.current = dataMode;
      initTimeoutRef.current = null;
    }, 100);

    // eslint-disable-next-line consistent-return
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
      if (map && typeof map.remove === 'function' && map.getContainer) {
        try {
          const container = map.getContainer();
          if (container) {
            map.remove();
          }
        } catch (error) {
          // Silently ignore - map may already be removed or in invalid state
        }
      }
      mapInitializedRef.current = false;
    };
  }, [dataMode]);

  // Color predictions when data changes
  useEffect(() => {
    if (!map) return;

    if (year.toString().length === 4 && data.length > 0) colorPredictions(data);

    zoomToSelectedState(selectedState, map);
  }, [data, selectedState, map, year, colorPredictions]);

  // Initial fill
  useEffect(() => {
    if (!initialFill && map && data.length > 0) {
      colorPredictions(data);
      setInitialFill(true);
    }
  }, [initialFill, map, data, colorPredictions, setInitialFill]);

  // Set up hover callback - create the actual mapbox event handler
  const hoverCallback = useMemo(() => {
    if (!map || !data) return null;
    return createMapHoverCallback(data, allRangerDistricts, dataMode, selectedState, availableStates);
  }, [map, data, allRangerDistricts, dataMode, selectedState, availableStates, isMobile, createMapHoverCallback]);

  // Set up click callback - create the actual mapbox event handler
  const clickCallback = useMemo(() => {
    if (!map || !availableStates || !availableSublocations) return null;
    return createMapClickCallback(
      availableStates,
      availableSublocations,
      selectedState,
      data,
      dataMode,
      props.county,
      setCounty,
      props.rangerDistrict,
      setRangerDistrict,
      setPredictionModal,
      isMobile,
    );
  }, [map, availableStates, availableSublocations, selectedState, data, dataMode, props.county, props.rangerDistrict, setCounty, setRangerDistrict, setPredictionModal, isMobile]);

  // Set up state click callback
  const stateClickCallback = useCallback((e) => {
    const { abbrev } = e?.features[0]?.properties || {};
    if (abbrev && selectedState !== abbrev && availableStates.includes(abbrev)) {
      setState(abbrev);
    }
  }, [selectedState, availableStates, setState]);

  // Set up mouse leave callback
  const mouseLeaveCallback = useCallback(() => {
    setPredictionHover(null);
  }, [setPredictionHover]);

  // Use shared callback hook
  useMapCallbacks(
    map,
    clickCallback,
    hoverCallback,
    stateClickCallback,
    mouseLeaveCallback,
    [availableStates, availableSublocations, selectedState, data, dataMode, allRangerDistricts, isMobile],
  );

  // Remove layer when data is empty
  useEffect(() => {
    if (data.length === 0 && map && map.isStyleLoaded && map.isStyleLoaded() && typeof map.getLayer === 'function') {
      try {
        if (map.getLayer(VECTOR_LAYER)) {
          map.removeLayer(VECTOR_LAYER);
        }
      } catch (error) {
        console.warn('Error removing layer:', error);
      }
    }
  }, [data, map]);

  // Helper function to get risk level label
  const getRiskLevel = (index) => {
    const riskLevels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High', 'Extreme'];
    return riskLevels[index] || 'Unknown';
  };

  // Prepare legend data for the overlay
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
          { titleDetails: { selectedState, period: year }, thresholds, colors },
        )}
        isDownloadingMap={isDownloadingMap}
      />
      <MapControls
        // Filter props
        availableStates={availableStates}
        availableYears={availableYears || []}
        availableSublocations={availableSublocations}
        county={county}
        dataMode={dataMode}
        predictionYear={year}
        rangerDistrict={rangerDistrict}
        selectedState={selectedState}
        setCounty={setCounty}
        setPredictionYear={setPredictionYear}
        setRangerDistrict={setRangerDistrict}
        setState={setState}
        clearAllSelections={clearAllSelections}
        // Legend props
        legendItems={legendItems}
        legendTitle="Outbreak Probability (%)"
        // Download props
        downloadCallback={() => downloadMap(
          map,
          year,
          isDownloadingMap,
          setIsDownloadingMap,
          selectedState,
          MAP_TITLES.PREDICTION,
          { titleDetails: { selectedState, period: year }, thresholds, colors },
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
