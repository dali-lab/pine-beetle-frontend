import mapboxgl from 'mapbox-gl';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  DATA_MODES,
  MAP_INIT_CONSTANTS,
  MAP_TITLES,
  VECTOR_LAYER,
} from '../../../constants';
import { useMapCallbacks, useMapState, useRangerDistricts } from '../../../hooks';
import {
  createHoverCallback,
  createMapClickCallback,
  downloadMap,
  generateMap,
  getMapboxRDNameFormat,
  getSourceLayer,
  parseYearFromItem,
  zoomToSelectedState,
} from '../../../utils';
import { logError, logWarning } from '../../../utils/logger';
import { isInvalidNumber } from '../../../utils/map';
import {
  addDefaultExpressions,
  addMapLayer,
  createBaseExpressions,
  removeVectorLayer,
} from '../../../utils/map-coloring';
import { isMapRemoved as checkMapRemoved, markMapAsRemoved as markMapRemoved } from '../../../utils/map-instance-tracker';
import Map from '../../map';
import MapControls from '../../map-controls/component';
import {
  colors,
  thresholds,
} from './constants';
import './style.scss';

const HistoricalMap = (props) => {
  const {
    availableStates,
    availableSublocations,
    county,
    dataMode,
    predictionYear,
    rangerDistrict,
    selectedState,
    setCounty,
    setRangerDistrict,
    setState,
    setCountyFilter,
    setRangerDistrictFilter,
    setStateFilter,
    clearAllSelections,
    sublocationData: rawData,
  } = props;

  const {
    map,
    setMap,
    initialFill,
    setInitialFill,
    hover: trappingHover,
    setHover: setTrappingHover,
    isDownloadingMap,
    setIsDownloadingMap,
  } = useMapState();

  const allRangerDistricts = useRangerDistricts(dataMode);

  const createMapHoverCallback = useCallback((allData, rangerDistricts, mode, state, availStates) => {
    const callback = (hoverState, location, x, y, counties) => {
      const sublocation = mode === DATA_MODES.COUNTY ? 'county' : 'rangerDistrict';

      const data = allData.filter((p) => {
        return (
          (mode === DATA_MODES.RANGER_DISTRICT || ((p.state === hoverState && p.state === state) || (!state && availStates.includes(hoverState))))
      && ((p[sublocation] === location))
        );
      }).filter((p) => p.state === hoverState || mode === DATA_MODES.RANGER_DISTRICT);

      if (data && data.length > 0 && x && y) {
        const {
          sumSpotst0,
          county: countyName,
        } = data[0];

        setTrappingHover((
          <div id="trapping-hover" style={{ left: `${x + 10}px`, top: `${y - 140}px` }}>
            <h3>{dataMode === DATA_MODES.COUNTY ? `${countyName} County` : `${counties[0].properties.forest.slice(0, -3)} Ranger District`}</h3>
            {!isInvalidNumber(sumSpotst0) ? <p>Spots: {sumSpotst0}</p> : null}
          </div>
        ));
      } else {
        setTrappingHover(null);
      }
    };

    return createHoverCallback(map, rangerDistricts, dataMode, callback);
  }, [map, dataMode, setTrappingHover]);

  const colorFill = (d) => {
    if (!map) return;

    if (!map.isStyleLoaded()) {
      setTimeout(() => {
        colorFill(d);
      }, 1000);
      return;
    }

    removeVectorLayer(map);

    const { fillExpression, strokeExpression } = createBaseExpressions(dataMode);

    const selectedYear = typeof predictionYear === 'string' ? parseInt(predictionYear, 10) : predictionYear;
    const filteredData = d.filter((item) => {
      const itemYear = parseYearFromItem(item);
      if (itemYear === null) return false;
      if (itemYear !== selectedYear) return false;

      // Apply visual filtering based on selected state, county, and rangerDistrict
      if (selectedState && item.state !== selectedState) return false;

      if (dataMode === DATA_MODES.COUNTY && county && county.length > 0) {
        if (!county.includes(item.county)) return false;
      }

      if (dataMode === DATA_MODES.RANGER_DISTRICT && rangerDistrict && rangerDistrict.length > 0) {
        if (!rangerDistrict.includes(item.rangerDistrict)) return false;
      }

      return true;
    });

    const trappingsByLocality = filteredData.reduce((acc, curr) => {
      const {
        county: itemCounty,
        rangerDistrict: itemRangerDistrict,
        state: itemState,
        sumSpotst0,
        spotst0,
        spots,
      } = curr;

      let spotsValue = null;
      if (sumSpotst0 !== undefined && sumSpotst0 !== null) {
        spotsValue = sumSpotst0;
      } else if (spotst0 !== undefined && spotst0 !== null) {
        spotsValue = spotst0;
      } else if (spots !== undefined && spots !== null) {
        spotsValue = spots;
      }

      const countyFormatName = itemCounty && itemState ? `${itemCounty} ${itemState}`.toUpperCase() : '';
      const rangerDistrictFormatName = itemRangerDistrict ? getMapboxRDNameFormat(itemRangerDistrict)?.toUpperCase() : '';

      const localityDescription = dataMode === DATA_MODES.COUNTY ? countyFormatName : rangerDistrictFormatName;

      if (localityDescription) {
        if (acc[localityDescription] === undefined) {
          return {
            ...acc,
            [localityDescription]: spotsValue,
          };
        }
      }
      return acc;
    }, {});

    Object.entries(trappingsByLocality).forEach(([localityDescription, sumSpotst0]) => {
      const [noData, zeroToNine, tenToNineteen, twentyToFortyNine, fiftyToNinetyNine, hundredToTwoFortyNine, twoFiftyPlus] = colors;
      let color;

      if (sumSpotst0 === null || sumSpotst0 === undefined) {
        color = noData;
      } else if (sumSpotst0 < 10) {
        color = zeroToNine;
      } else if (sumSpotst0 < 20) {
        color = tenToNineteen;
      } else if (sumSpotst0 < 50) {
        color = twentyToFortyNine;
      } else if (sumSpotst0 < 100) {
        color = fiftyToNinetyNine;
      } else if (sumSpotst0 < 250) {
        color = hundredToTwoFortyNine;
      } else {
        color = twoFiftyPlus;
      }

      fillExpression.push(localityDescription, color);
      strokeExpression.push(localityDescription, '#000000');
    });

    addDefaultExpressions(fillExpression, strokeExpression);

    addMapLayer(map, fillExpression, strokeExpression, getSourceLayer(dataMode), dataMode);
  };

  const mapInitializedRef = useRef(false);
  const lastDataModeRef = useRef(dataMode);
  const initTimeoutRef = useRef(null);
  const containerRetryCountRef = useRef(0);

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
      const checkContainer = () => {
        if (containerRetryCountRef.current >= MAP_INIT_CONSTANTS.MAX_CONTAINER_CHECK_RETRIES) {
          logError('Map container not found after maximum retries', null, { component: 'TrappingDataMap' });
          return;
        }

        const container = document.getElementById('map');
        if (container) {
          containerRetryCountRef.current = 0;
          generateMap({
            forceRegenerate: true,
            map: currentMap,
            dataMode,
            setMap,
          });
          mapInitializedRef.current = true;
          lastDataModeRef.current = dataMode;
          initTimeoutRef.current = null;
        } else {
          containerRetryCountRef.current += 1;
          setTimeout(checkContainer, MAP_INIT_CONSTANTS.CONTAINER_CHECK_INTERVAL);
        }
      };
      checkContainer();
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
          logError('Error cleaning up map', error, { component: 'TrappingDataMap' });
        }
      }
      mapInitializedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataMode]);

  useEffect(() => {
    if (!map) return;

    if (predictionYear.toString().length === 4) colorFill(rawData);

    zoomToSelectedState(selectedState, map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData, selectedState, map, predictionYear, county, rangerDistrict]);

  useEffect(() => {
    if (!initialFill && map && rawData.length > 0) {
      colorFill(rawData);
      setInitialFill(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFill, map, rawData, setInitialFill]);

  const hoverCallback = useMemo(() => {
    if (!map || !rawData) return null;
    return createMapHoverCallback(rawData, allRangerDistricts, dataMode, selectedState, availableStates);
  }, [map, rawData, allRangerDistricts, dataMode, selectedState, availableStates, createMapHoverCallback]);

  const clickCallback = useMemo(() => {
    if (!map || !availableStates || !availableSublocations) return null;
    return createMapClickCallback({
      states: availableStates,
      sublocations: availableSublocations,
      currentState: selectedState,
      data: rawData,
      dataMode,
      county: props.county,
      setCounty,
      rangerDistrict: props.rangerDistrict,
      setRangerDistrict,
    });
  }, [map, availableStates, availableSublocations, selectedState, rawData, dataMode, props.county, props.rangerDistrict, setCounty, setRangerDistrict]);

  const stateClickCallback = useCallback((e) => {
    const { abbrev } = e?.features[0]?.properties || {};
    if (abbrev && selectedState !== abbrev && availableStates.includes(abbrev)) {
      setState(abbrev);
    }
  }, [selectedState, availableStates, setState]);

  const mouseLeaveCallback = useCallback(() => {
    setTrappingHover(null);
  }, [setTrappingHover]);

  useMapCallbacks(
    map,
    clickCallback,
    hoverCallback,
    stateClickCallback,
    mouseLeaveCallback,
    [availableStates, availableSublocations, selectedState, rawData, dataMode, allRangerDistricts]
  );

  useEffect(() => {
    if (rawData.length === 0 && map && map.isStyleLoaded && map.isStyleLoaded() && typeof map.getLayer === 'function') {
      try {
        if (map.getLayer(VECTOR_LAYER)) {
          map.removeLayer(VECTOR_LAYER);
        }
      } catch (error) {
        logWarning('Error removing layer', error, { component: 'TrappingDataMap' });
      }
    }
  }, [rawData, map]);

  useEffect(() => {
    const handleDownloadClick = (event) => {
      if (!event.target.matches('.download-button') && !event.target.matches('.download-button p')) return;
      downloadMap(
        map,
        predictionYear,
        isDownloadingMap,
        setIsDownloadingMap,
        selectedState,
        MAP_TITLES.HISTORICAL,
        { titleDetails: { selectedState, period: predictionYear }, thresholds, colors }
      );
    };

    document.addEventListener('click', handleDownloadClick, false);

    return () => {
      document.removeEventListener('click', handleDownloadClick, false);
    };
  }, [map, predictionYear, isDownloadingMap, setIsDownloadingMap, selectedState]);

  const getRiskLevel = (index) => {
    const riskLevels = ['No Data', '0-9', '10-19', '20-49', '50-99', '100-249', '250+'];
    return riskLevels[index] || 'Unknown';
  };

  const legendItems = thresholds.map((threshold, index) => ({
    color: colors[index],
    label: `${threshold} (${getRiskLevel(index)})`,
  }));

  return (
    <div className="container flex-item-left" id="map-container">
      <Map
        hover={trappingHover}
      />
      <MapControls
        availableStates={availableStates}
        availableYears={[]}
        availableSublocations={availableSublocations}
        county={county}
        dataMode={dataMode}
        predictionYear={predictionYear}
        rangerDistrict={rangerDistrict}
        selectedState={selectedState}
        setCounty={setCountyFilter}
        setPredictionYear={() => {}}
        setRangerDistrict={setRangerDistrictFilter}
        setState={setStateFilter}
        clearAllSelections={clearAllSelections}
        legendItems={legendItems}
        legendTitle="Total Number of Spots"
        downloadCallback={() => downloadMap(
          map,
          predictionYear,
          isDownloadingMap,
          setIsDownloadingMap,
          selectedState,
          MAP_TITLES.HISTORICAL,
          { titleDetails: { selectedState, period: predictionYear }, thresholds, colors }
        )}
        isDownloadingMap={isDownloadingMap}
        hideFilters
      />
    </div>
  );
};

export default HistoricalMap;
