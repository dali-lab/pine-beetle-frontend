import mapboxgl from 'mapbox-gl';
import React, {
  useCallback, useEffect, useMemo, useRef,
} from 'react';
import MapComponent from '../../../../components/map';
import MapControls from '../../../../components/map-controls/component';
import TogglesOverlay from '../../../../components/map/components';
import {
  DATA_MODES,
  MAP_TITLES,
  VECTOR_LAYER,
} from '../../../../constants';
import {
  useMapCallbacks,
  useMapState,
  useRangerDistricts,
} from '../../../../hooks';
import {
  createHoverCallback,
  createMapClickCallback,
  downloadMap,
  formatLocationForMapbox,
  generateMap,
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
import { colors, thresholds } from './constants';
import './style.scss';

const MAP_INIT_DELAY = 100;
const CONTAINER_CHECK_INTERVAL = 50;
const PROBABILITY_THRESHOLD = 0.2;
const SPOTS_THRESHOLD = 50;

/**
 * Determines fill color based on prediction probability and actual spots count.
 * Color mapping:
 * - colors[0]: Predicted outbreak (prob >= 0.2) AND outbreak occurred (spots > 50)
 * - colors[1]: No prediction (prob < 0.2) AND no outbreak (spots <= 50)
 * - colors[2]: No prediction (prob < 0.2) BUT outbreak occurred (spots > 50) - false negative
 * - colors[3]: Predicted outbreak (prob >= 0.2) BUT no outbreak (spots <= 50) - false positive
 * - colors[4]: Fallback/default color (should rarely be used)
 */
const getFillColor = (fillProb, sumSpots) => {
  if (fillProb >= PROBABILITY_THRESHOLD && sumSpots > SPOTS_THRESHOLD) {
    return colors[0];
  }
  if (fillProb < PROBABILITY_THRESHOLD && sumSpots <= SPOTS_THRESHOLD) {
    return colors[1];
  }
  if (fillProb < PROBABILITY_THRESHOLD && sumSpots > SPOTS_THRESHOLD) {
    return colors[2];
  }
  if (fillProb >= PROBABILITY_THRESHOLD && sumSpots <= SPOTS_THRESHOLD) {
    return colors[3];
  }
  return colors[4];
};

const ComparisonMap = (props) => {
  const {
    availableStates,
    availableSublocations,
    data,
    dataMode,
    selectedState,
    setCounty,
    setDataMode,
    setRangerDistrict,
    setState,
    year,
    isLoading,
  } = props;

  const {
    map,
    setMap,
    initialFill,
    setInitialFill,
    hover: resultsHover,
    setHover: setResultsHover,
    isDownloadingMap,
    setIsDownloadingMap,
  } = useMapState();

  const allRangerDistricts = useRangerDistricts(dataMode);

  const colorResultsTimeoutRef = useRef(null);
  const mapInitTimeoutRef = useRef(null);
  const containerCheckTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (colorResultsTimeoutRef.current) {
        clearTimeout(colorResultsTimeoutRef.current);
        colorResultsTimeoutRef.current = null;
      }
      if (mapInitTimeoutRef.current) {
        clearTimeout(mapInitTimeoutRef.current);
        mapInitTimeoutRef.current = null;
      }
      if (containerCheckTimeoutRef.current) {
        clearTimeout(containerCheckTimeoutRef.current);
        containerCheckTimeoutRef.current = null;
      }
    };
  }, []);

  const dataLookupMap = useMemo(() => {
    if (!data || data.length === 0) return new Map();

    const lookup = new Map();
    data.forEach((p) => {
      if (dataMode === DATA_MODES.COUNTY) {
        const key = `${p.state}-${p.county}`;
        lookup.set(key, p);
      } else {
        const key = `${p.state || ''}-${p.rangerDistrict || ''}`;
        if (key !== '-') lookup.set(key, p);
      }
    });
    return lookup;
  }, [data, dataMode]);

  const createMapHoverCallback = useCallback((resultsData, rangerDistricts, mode, state, availStates, lookupMap) => {
    const callback = (hoverState, location, x, y) => {
      if (!hoverState || !location) {
        setResultsHover(null);
        return;
      }

      let pred = null;
      if (lookupMap && lookupMap.size > 0) {
        const key = `${hoverState}-${location}`;
        pred = lookupMap.get(key);
      } else {
        pred = resultsData.find((p) => {
          const stateMatches = mode === DATA_MODES.RANGER_DISTRICT
            || (state ? (p.state === hoverState && p.state === state) : availStates.includes(hoverState));
          const locationMatches = mode === DATA_MODES.COUNTY
            ? (p.county === location && p.state === hoverState)
            : (p.rangerDistrict === location);

          return stateMatches && locationMatches;
        });
      }

      if (pred && x && y) {
        const {
          county: countyName,
          probSpotsGT50: probOutbreak,
          sumSpots: spotsCount,
        } = pred;

        setResultsHover((
          <div id="prediction-hover" style={mapboxHoverStyle(x, y)}>
            <h3>{dataMode === DATA_MODES.COUNTY ? `${countyName} County` : `${getMapboxRDNameFormat(location).slice(0, -3)} Ranger District`}</h3>
            <p>Predicted probability of an outbreak: {isInvalidNumber(probOutbreak) ? 'null' : (probOutbreak * 100).toFixed(1)}%</p>
            <p>Number of spots: {isInvalidNumber(spotsCount) ? 'null' : spotsCount}</p>
          </div>
        ));
      } else {
        setResultsHover(null);
      }
    };

    return createHoverCallback(map, rangerDistricts, dataMode, callback);
  }, [map, dataMode, setResultsHover]);

  const colorResults = useCallback((comparisonData) => {
    if (!isMountedRef.current || !map) return;

    if (!waitForStyleLoad(map, colorResults, [comparisonData], colorResultsTimeoutRef, isMountedRef)) {
      return;
    }

    removeVectorLayer(map);

    const { fillExpression, strokeExpression } = createBaseExpressions();

    comparisonData.forEach(({
      county,
      probSpotsGT50: fillProb,
      sumSpots,
      rangerDistrict,
      state,
    }) => {
      const color = getFillColor(fillProb, sumSpots);

      const locationName = formatLocationForMapbox(dataMode, {
        county,
        rangerDistrict,
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

    addMapLayer(map, fillExpression, strokeExpression, getSourceLayer(dataMode));
  }, [map, dataMode]);

  const mapInitializedRef = useRef(false);
  const lastDataModeRef = useRef(dataMode);

  const latestValuesRef = useRef({
    availableStates,
    availableSublocations,
    selectedState,
    data,
    allRangerDistricts,
    dataLookupMap,
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
      dataLookupMap,
      county: props.county,
      rangerDistrict: props.rangerDistrict,
    };
  });

  useEffect(() => {
    const shouldRegenerate = !map || lastDataModeRef.current !== dataMode;

    if (!shouldRegenerate && mapInitializedRef.current) {
      return;
    }

    if (mapInitTimeoutRef.current) {
      clearTimeout(mapInitTimeoutRef.current);
      mapInitTimeoutRef.current = null;
    }
    if (containerCheckTimeoutRef.current) {
      clearTimeout(containerCheckTimeoutRef.current);
      containerCheckTimeoutRef.current = null;
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
    );
    const hoverCallback = createMapHoverCallback(
      latest.data,
      latest.allRangerDistricts,
      dataMode,
      latest.selectedState,
      latest.availableStates,
      latest.dataLookupMap,
    );

    const currentMap = map;

    mapInitTimeoutRef.current = setTimeout(() => {
      mapInitTimeoutRef.current = null;

      if (!isMountedRef.current) return;

      const checkContainer = () => {
        if (!isMountedRef.current) return;

        const container = document.getElementById('map');
        if (container) {
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
        } else {
          containerCheckTimeoutRef.current = setTimeout(() => {
            containerCheckTimeoutRef.current = null;
            if (isMountedRef.current) {
              checkContainer();
            }
          }, CONTAINER_CHECK_INTERVAL);
        }
      };
      checkContainer();
    }, MAP_INIT_DELAY);

    // eslint-disable-next-line consistent-return
    return () => {
      if (mapInitTimeoutRef.current) {
        clearTimeout(mapInitTimeoutRef.current);
        mapInitTimeoutRef.current = null;
      }
      if (containerCheckTimeoutRef.current) {
        clearTimeout(containerCheckTimeoutRef.current);
        containerCheckTimeoutRef.current = null;
      }
      if (map && typeof map.remove === 'function' && map.getContainer) {
        try {
          const container = map.getContainer();
          if (container) {
            map.remove();
          }
        } catch (error) {
          console.error('Error cleaning up map:', error);
        }
      }
      mapInitializedRef.current = false;
    };
  }, [dataMode]);

  useEffect(() => {
    if (!map) return;
    if (year.toString().length === 4 && data.length > 0) colorResults(data);

    zoomToSelectedState(selectedState, map);
  }, [data, selectedState, map, dataMode, year, colorResults]);

  useEffect(() => {
    if (!initialFill && map && data.length > 0) {
      colorResults(data);
      setInitialFill(true);
    }
  }, [initialFill, map, data, colorResults, setInitialFill]);

  const hoverCallback = useMemo(() => {
    if (!map || !data) return null;
    return createMapHoverCallback(data, allRangerDistricts, dataMode, selectedState, availableStates, dataLookupMap);
  }, [map, data, allRangerDistricts, dataMode, selectedState, availableStates, dataLookupMap, createMapHoverCallback]);

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
    );
  }, [map, availableStates, availableSublocations, selectedState, data, dataMode, props.county, props.rangerDistrict, setCounty, setRangerDistrict]);

  const stateClickCallback = useCallback((e) => {
    const { abbrev } = e?.features[0]?.properties || {};
    if (abbrev && selectedState !== abbrev && availableStates.includes(abbrev)) {
      setState(abbrev);
    }
  }, [selectedState, availableStates, setState]);

  const mouseLeaveCallback = useCallback(() => {
    setResultsHover(null);
  }, [setResultsHover]);

  useMapCallbacks(
    map,
    clickCallback,
    hoverCallback,
    stateClickCallback,
    mouseLeaveCallback,
    [availableStates, availableSublocations, selectedState, data, dataMode, allRangerDistricts, dataLookupMap],
  );

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

  const getShortLabel = (threshold) => {
    const labelMap = {
      'outbreak predicted, outbreak occurred': 'Predicted, Occurred',
      'outbreak not predicted, outbreak did not occur': 'Not Predicted, Did Not Occur',
      'outbreak not predicted, outbreak occurred': 'Not Predicted, Occurred',
      'outbreak predicted, outbreak did not occur': 'Predicted, Did Not Occur',
    };
    return labelMap[threshold] || threshold;
  };

  const legendItems = thresholds.map((threshold, index) => ({
    color: colors[index],
    label: getShortLabel(threshold),
  }));

  return (
    <div className="container flex-item-left results-comparison-map" id="map-container">
      <TogglesOverlay dataMode={dataMode} setDataMode={setDataMode} />
      <MapComponent
        hover={resultsHover}
      />
      <MapControls
        availableStates={availableStates}
        availableYears={[]} // Results comparison doesn't have years filter
        availableSublocations={availableSublocations}
        county={props.county}
        dataMode={dataMode}
        predictionYear={year}
        rangerDistrict={props.rangerDistrict}
        selectedState={selectedState}
        setCounty={setCounty}
        setPredictionYear={() => {}} // No year setting for results comparison
        setRangerDistrict={setRangerDistrict}
        setState={setState}
        clearAllSelections={props.clearAllSelections}
        legendItems={legendItems}
        legendTitle="Results comparison"
        downloadCallback={() => downloadMap(
          map,
          year,
          isDownloadingMap,
          setIsDownloadingMap,
          selectedState,
          MAP_TITLES.COMPARISON,
          { titleDetails: { selectedState, period: year }, thresholds, colors },
        )}
        isDownloadingMap={isDownloadingMap}
        hideFilters
      />
      {!isLoading && !data.length && (
        <div className="results-comparison-message">
          <p>
            {`Map for ${year} not yet available. Spot data for the previous year usually come online sometime in January or February of the following year.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ComparisonMap;
