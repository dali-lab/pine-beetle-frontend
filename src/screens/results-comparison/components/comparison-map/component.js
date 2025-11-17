import mapboxgl from 'mapbox-gl';
import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import Map from '../../../../components/map';
import MapControls from '../../../../components/map-controls/component';
import TogglesOverlay from '../../../../components/map/components';
import {
  DATA_MODES, MAP_SOURCE_NAME, MAP_TITLES, SOURCE_LAYERS, STATE_VECTOR_LAYER, VECTOR_LAYER,
} from '../../../../constants';
import { api } from '../../../../services';
import {
  createHoverCallback,
  createMapClickCallback,
  downloadMap,
  generateMap,
  getMapboxRDNameFormat,
  mapboxHoverStyle,
  zoomToSelectedState,
} from '../../../../utils';
import { colors, thresholds } from './constants';

import { isInvalidNumber } from '../../../../utils/map';
import './style.scss';

// Constants for magic numbers
const STYLE_CHECK_INTERVAL = 1000; // ms - interval for checking if map styles are loaded
const MAP_INIT_DELAY = 100; // ms - delay before initializing map
const CONTAINER_CHECK_INTERVAL = 50; // ms - interval for checking if map container exists
const PROBABILITY_THRESHOLD = 0.2; // probability threshold for outbreak prediction
const SPOTS_THRESHOLD = 50; // spots count threshold for outbreak classification

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
    return colors[0]; // Predicted, Occurred
  }
  if (fillProb < PROBABILITY_THRESHOLD && sumSpots <= SPOTS_THRESHOLD) {
    return colors[1]; // Not Predicted, Did Not Occur
  }
  if (fillProb < PROBABILITY_THRESHOLD && sumSpots > SPOTS_THRESHOLD) {
    return colors[2]; // Not Predicted, Occurred (false negative)
  }
  if (fillProb >= PROBABILITY_THRESHOLD && sumSpots <= SPOTS_THRESHOLD) {
    return colors[3]; // Predicted, Did Not Occur (false positive)
  }
  return colors[4]; // Fallback (should rarely be reached)
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
  const [map, setMap] = useState();
  const [initialFill, setInitialFill] = useState(false);
  const [resultsHover, setResultsHover] = useState(null);
  const [isDownloadingMap, setIsDownloadingMap] = useState(false);
  const [mapClickCallback, setMapClickCallback] = useState();
  const [mapHoverCallback, setMapHoverCallback] = useState();
  const [mapStateClickCallback, setMapStateClickCallback] = useState();
  const [mapLayerMouseLeaveCallback, setMapLayerMouseLeaveCallback] = useState();
  const [allRangerDistricts, setAllRangerDistricts] = useState([]);

  // Refs for cleanup and abort mechanisms
  const colorResultsTimeoutRef = useRef(null);
  const mapInitTimeoutRef = useRef(null);
  const containerCheckTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Cleanup all timeouts on unmount
      if (colorResultsTimeoutRef.current) {
        clearTimeout(colorResultsTimeoutRef.current);
      }
      if (mapInitTimeoutRef.current) {
        clearTimeout(mapInitTimeoutRef.current);
      }
      if (containerCheckTimeoutRef.current) {
        clearTimeout(containerCheckTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (dataMode === DATA_MODES.RANGER_DISTRICT) {
      api.getAvailableSublocations(dataMode)
        .then(setAllRangerDistricts)
        .catch((error) => {
          console.error('Failed to fetch ranger districts:', error);
          // Could add user-facing error notification here
        });
    } else {
      setAllRangerDistricts([]);
    }
  }, [dataMode]);

  // Create optimized data lookup map for O(1) lookups
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

  // Memoized function to create hover callback
  const createMapHoverCallback = useCallback((resultsData, rangerDistricts, mode, state, availStates, lookupMap) => {
    const callback = (hoverState, location, x, y) => {
      if (!hoverState || !location) {
        setResultsHover(null);
        return;
      }

      // Use lookup map for O(1) access instead of O(n) find
      let pred = null;
      if (lookupMap && lookupMap.size > 0) {
        const key = `${hoverState}-${location}`;
        pred = lookupMap.get(key);
      } else {
        // Fallback to find if lookup map is not available
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
  }, [map, dataMode]);

  const colorResults = (comparisonData) => {
    // Abort if component is unmounted
    if (!isMountedRef.current || !map) return;

    // keep trying until map styles are loaded
    if (!map.isStyleLoaded()) {
      // Clear any existing timeout
      if (colorResultsTimeoutRef.current) {
        clearTimeout(colorResultsTimeoutRef.current);
      }

      colorResultsTimeoutRef.current = setTimeout(() => {
        colorResultsTimeoutRef.current = null;
        if (isMountedRef.current) {
          colorResults(comparisonData);
        }
      }, STYLE_CHECK_INTERVAL);

      return;
    }

    // remove county layer if already constructed
    if (map.getLayer(VECTOR_LAYER)) {
      map.removeLayer(VECTOR_LAYER);
    }

    const fillExpression = ['match', ['upcase', ['get', 'forest']]];
    const strokeExpression = ['match', ['upcase', ['get', 'forest']]];

    comparisonData.forEach(({
      county,
      probSpotsGT50: fillProb,
      sumSpots,
      rangerDistrict,
      state,
    }) => {
      const color = getFillColor(fillProb, sumSpots);

      const countyFormatName = county && state ? `${county.toUpperCase()} ${state}` : '';
      const rangerDistrictFormatName = rangerDistrict ? getMapboxRDNameFormat(rangerDistrict).toUpperCase() : '';

      // Make locationName handling consistent for both modes - always return array
      const locationName = dataMode === DATA_MODES.COUNTY
        ? [countyFormatName].filter((str) => !!str)
        // handles case where tileset has two spaces instead of one (this is a one-off), or is missing the word RD altogether (also one-off)
        : [rangerDistrictFormatName, rangerDistrictFormatName.replace(' RD', '  RD'), rangerDistrictFormatName.replace(' RD', '')]
          .filter((str) => !!str);

      // Handle array of location names (for ranger districts) or single location (for counties)
      if (locationName.length > 0) {
        locationName.forEach((name) => {
          fillExpression.push(name, color);
          strokeExpression.push(name, '#000000');
        });
      }
    });

    // last value is the default, used where there is no data
    fillExpression.push('rgba(0,0,0,0)');
    strokeExpression.push('rgba(0,0,0,0)');
    // add layer from the vector tile source with data-driven style
    // double-checking if we have valid fillExpression for paint
    if (fillExpression.length > 3) {
      map.addLayer({
        id: VECTOR_LAYER,
        type: 'fill',
        source: MAP_SOURCE_NAME,
        'source-layer': dataMode === DATA_MODES.COUNTY ? SOURCE_LAYERS.COUNTY : SOURCE_LAYERS.RANGER_DISTRICT,
        paint: {
          'fill-color': fillExpression,
          'fill-outline-color': strokeExpression,
        },
      }, 'water-point-label');
    }
  };

  useEffect(() => {
    // Clear any existing timeouts
    if (mapInitTimeoutRef.current) {
      clearTimeout(mapInitTimeoutRef.current);
    }
    if (containerCheckTimeoutRef.current) {
      clearTimeout(containerCheckTimeoutRef.current);
    }

    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
    const clickCallback = createMapClickCallback(
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
    const hoverCallback = createMapHoverCallback(
      data,
      allRangerDistricts,
      dataMode,
      selectedState,
      availableStates,
      dataLookupMap,
    );

    mapInitTimeoutRef.current = setTimeout(() => {
      mapInitTimeoutRef.current = null;

      if (!isMountedRef.current) return;

      setMap(undefined);
      // Wait for the map container to be available
      const checkContainer = () => {
        if (!isMountedRef.current) return;

        const container = document.getElementById('map');
        if (container) {
          // Only generate map if container exists and component is still mounted
          generateMap(
            true,
            map,
            thresholds,
            colors,
            () => {},
            dataMode,
            clickCallback,
            setMapClickCallback,
            hoverCallback,
            setMapHoverCallback,
            setMap,
          );
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

    return () => {
      // Cleanup timeouts on unmount or dependency change
      if (mapInitTimeoutRef.current) {
        clearTimeout(mapInitTimeoutRef.current);
        mapInitTimeoutRef.current = null;
      }
      if (containerCheckTimeoutRef.current) {
        clearTimeout(containerCheckTimeoutRef.current);
        containerCheckTimeoutRef.current = null;
      }
    };
  }, [dataMode, availableStates, availableSublocations, selectedState, data, allRangerDistricts, dataLookupMap]);

  useEffect(() => {
    if (!map) return;
    if (year.toString().length === 4 && data.length > 0) colorResults(data);

    zoomToSelectedState(selectedState, map);
  }, [data, selectedState, map, dataMode, year]);

  useEffect(() => {
    if (!initialFill && map && data.length > 0) {
      colorResults(data);
      setInitialFill(true);
    }

    if (map && data) {
      // Remove current callback
      if (mapHoverCallback) {
        map.off('mousemove', mapHoverCallback);
      }

      const callback = createMapHoverCallback(data, allRangerDistricts, dataMode, selectedState, availableStates, dataLookupMap);
      // Store callback directly instead of function wrapper
      setMapHoverCallback(callback);
      map.on('mousemove', callback);
    }

    return () => {
      // Cleanup on unmount or dependency change
      if (map && mapHoverCallback) {
        map.off('mousemove', mapHoverCallback);
      }
    };
  }, [map, data, allRangerDistricts, dataMode, selectedState, availableStates, dataLookupMap, createMapHoverCallback]);

  useEffect(() => {
    if (map && availableStates && availableSublocations) {
      // Remove current callback
      if (mapClickCallback) {
        map.off('click', VECTOR_LAYER, mapClickCallback);
      }

      const callback = createMapClickCallback(
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
      // Store callback directly instead of function wrapper
      setMapClickCallback(callback);
      map.on('click', VECTOR_LAYER, callback);
    }

    return () => {
      // Cleanup on unmount or dependency change
      if (map && mapClickCallback) {
        map.off('click', VECTOR_LAYER, mapClickCallback);
      }
    };
  }, [map, availableStates, availableSublocations, selectedState, data, dataMode, props.county, props.rangerDistrict, setCounty, setRangerDistrict]);

  useEffect(() => {
    if (map) {
      // Remove current callback
      if (mapStateClickCallback) {
        map.off('click', STATE_VECTOR_LAYER, mapStateClickCallback);
      }

      const callback = (e) => {
        const { abbrev } = e?.features[0]?.properties || {};

        if (abbrev && selectedState !== abbrev && availableStates.includes(abbrev)) {
          setState(abbrev);
        }
      };

      // Store callback directly instead of function wrapper
      setMapStateClickCallback(callback);
      map.on('click', STATE_VECTOR_LAYER, callback);
    }

    return () => {
      // Cleanup on unmount or dependency change
      if (map && mapStateClickCallback) {
        map.off('click', STATE_VECTOR_LAYER, mapStateClickCallback);
      }
    };
  }, [map, availableStates, selectedState, setState]);

  useEffect(() => {
    if (map) {
      // Remove current callback
      if (mapLayerMouseLeaveCallback) {
        map.off('mouseleave', VECTOR_LAYER, mapLayerMouseLeaveCallback);
      }

      const callback = () => setResultsHover(null);

      // Store callback directly instead of function wrapper
      setMapLayerMouseLeaveCallback(callback);
      map.on('mouseleave', VECTOR_LAYER, callback);
    }

    return () => {
      // Cleanup on unmount or dependency change
      if (map && mapLayerMouseLeaveCallback) {
        map.off('mouseleave', VECTOR_LAYER, mapLayerMouseLeaveCallback);
      }
    };
  }, [map]);

  useEffect(() => {
    if (data.length === 0 && map && map.getLayer(VECTOR_LAYER)) {
      map.removeLayer(VECTOR_LAYER);
    }
  }, [data, map]);

  // Prepare legend data for the overlay with shorter labels
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
      <Map
        hover={resultsHover}
      />
      <MapControls
          // Filter props
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
          // Legend props
        legendItems={legendItems}
        legendTitle="Results comparison"
          // Download props
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
          // Hide filters
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
