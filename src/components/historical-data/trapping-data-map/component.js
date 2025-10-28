import mapboxgl from 'mapbox-gl';
import React, { useEffect, useState } from 'react';

import {
  DATA_MODES,
  MAP_SOURCE_NAME,
  MAP_TITLES,
  SOURCE_LAYERS,
  STATE_VECTOR_LAYER,
  VECTOR_LAYER,
} from '../../../constants';

import { api } from '../../../services';
import {
  createHoverCallback,
  createMapClickCallback,
  downloadMap,
  generateMap,
  getMapboxRDNameFormat,
  zoomToSelectedState,
} from '../../../utils';

import {
  colors,
  thresholds,
} from './constants';

import { isInvalidNumber } from '../../../utils/map';
import Map from '../../map';
import MapControls from '../../map-controls/component';
import './style.scss';

const HistoricalMap = (props) => {
  const {
    availableStates,
    availableSublocations,
    dataMode,
    predictionYear,
    selectedState,
    setCounty,
    setRangerDistrict,
    setState,
    sublocationData: rawData,
  } = props;

  const [map, setMap] = useState();
  const [initialFill, setInitialFill] = useState(false);
  const [trappingHover, setTrappingHover] = useState(null);
  const [isDownloadingMap, setIsDownloadingMap] = useState(false);
  const [mapClickCallback, setMapClickCallback] = useState();
  const [mapHoverCallback, setMapHoverCallback] = useState();
  const [mapStateClickCallback, setMapStateClickCallback] = useState();
  const [mapLayerMouseLeaveCallback, setMapLayerMouseLeaveCallback] = useState();
  const [allRangerDistricts, setAllRangerDistricts] = useState([]);

  useEffect(() => {
    if (dataMode === DATA_MODES.RANGER_DISTRICT) {
      api.getAvailableSublocations(dataMode)
        .then(setAllRangerDistricts)
        .catch(console.error);
    }
  }, [dataMode]);

  const createMapHoverCallback = (allData, rangerDistricts, mode, state, availStates) => {
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
  };

  const colorFill = (d) => {
    if (!map.isStyleLoaded()) {
      setTimeout(() => {
        colorFill(d);
      }, 1000);

      return;
    }

    if (map.getLayer(VECTOR_LAYER)) {
      map.removeLayer(VECTOR_LAYER);
    }

    const fillExpression = ['match', ['upcase', ['get', 'forest']]];
    const strokeExpression = ['match', ['upcase', ['get', 'forest']]];

    const trappingsByLocality = d.reduce((acc, curr) => {
      const {
        county,
        rangerDistrict,
        state,
        sumSpotst0,
      } = curr;

      const countyFormatName = `${county} ${state}`.toUpperCase();
      const rangerDistrictFormatName = rangerDistrict ? getMapboxRDNameFormat(rangerDistrict)?.toUpperCase() : '';

      const localityDescription = dataMode === DATA_MODES.COUNTY ? countyFormatName : rangerDistrictFormatName;

      return {
        ...acc,
        [localityDescription]: sumSpotst0,
      };
    }, {});

    Object.entries(trappingsByLocality).forEach(([localityDescription, sumSpotst0]) => {
      const [noData, zeroToNine, tenToNineteen, twentyToFortyNine, fiftyToNinetyNine, hundredToTwoFortyNine, twoFiftyPlus] = colors;
      let color;

      if (sumSpotst0 === null) {
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

    fillExpression.push('rgba(0,0,0,0)');
    strokeExpression.push('rgba(0,0,0,0)');

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
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
    const clickCallback = createMapClickCallback(availableStates, availableSublocations, selectedState, rawData, dataMode, props.county, setCounty, props.rangerDistrict, setRangerDistrict);
    const hoverCallback = createMapHoverCallback(rawData, allRangerDistricts, dataMode, selectedState, availableStates);

    setTimeout(() => {
      setMap(undefined);
      const checkContainer = () => {
        if (document.getElementById('map')) {
          generateMap(true, map, thresholds, colors, () => {}, dataMode, clickCallback, setMapClickCallback, hoverCallback, setMapHoverCallback, setMap);
        } else {
          setTimeout(checkContainer, 50);
        }
      };
      checkContainer();

      document.addEventListener('click', (event) => {
        if (!event.target.matches('.download-button')) return;
        downloadMap(
          map,
          predictionYear,
          isDownloadingMap,
          setIsDownloadingMap,
          selectedState,
          MAP_TITLES.HISTORICAL,
          { titleDetails: { selectedState, period: predictionYear }, thresholds, colors },
        );
      }, false);

      document.addEventListener('click', (event) => {
        if (!event.target.matches('.download-button p')) return;
        downloadMap(
          map,
          predictionYear,
          isDownloadingMap,
          setIsDownloadingMap,
          selectedState,
          MAP_TITLES.HISTORICAL,
          { titleDetails: { selectedState, period: predictionYear }, thresholds, colors },
        );
      }, false);
    }, 100);
  }, [dataMode]);

  useEffect(() => {
    if (!map) return;

    if (predictionYear.toString().length === 4) colorFill(rawData);

    zoomToSelectedState(selectedState, map);
  }, [rawData, selectedState, map]);

  useEffect(() => {
    if (!initialFill && map && rawData.length > 0) {
      colorFill(rawData);
      setInitialFill(true);
    }

    if (map && rawData) {
      if (mapHoverCallback) map.off('mousemove', mapHoverCallback);

      const callback = createMapHoverCallback(rawData, allRangerDistricts, dataMode, selectedState, availableStates);
      setMapHoverCallback(() => callback);
      map.on('mousemove', callback);
    }
  }, [
    map,
    rawData,
    allRangerDistricts,
    availableSublocations,
    dataMode,
    selectedState,
    availableStates,
  ]);

  useEffect(() => {
    if (map && availableStates && availableSublocations) {
      if (mapClickCallback) map.off('click', VECTOR_LAYER, mapClickCallback);

      const callback = createMapClickCallback(availableStates, availableSublocations, selectedState, rawData, dataMode, props.county, setCounty, props.rangerDistrict, setRangerDistrict);
      setMapClickCallback(() => callback);
      map.on('click', VECTOR_LAYER, callback);
    }
  }, [
    map,
    availableStates,
    availableSublocations,
    selectedState,
    rawData,
    dataMode,
  ]);

  useEffect(() => {
    if (map) {
      if (mapStateClickCallback) map.off('click', STATE_VECTOR_LAYER, mapStateClickCallback);

      const callback = (e) => {
        const { abbrev } = e?.features[0]?.properties || {};

        if (abbrev && selectedState !== abbrev && availableStates.includes(abbrev)) {
          setState(abbrev);
        }
      };

      setMapStateClickCallback(() => callback);
      map.on('click', STATE_VECTOR_LAYER, callback);
    }
  }, [map, availableStates, selectedState]);

  useEffect(() => {
    if (map) {
      if (mapLayerMouseLeaveCallback) map.off('click', VECTOR_LAYER, mapLayerMouseLeaveCallback);

      const callback = () => setTrappingHover(null);

      setMapLayerMouseLeaveCallback(() => callback);
      map.on('mouseleave', VECTOR_LAYER, callback);
    }
  }, [map]);

  useEffect(() => {
    if (rawData.length === 0 && map && map.getLayer(VECTOR_LAYER)) {
      map.removeLayer(VECTOR_LAYER);
    }
  }, [rawData]);

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
        county={props.county}
        dataMode={dataMode}
        predictionYear={predictionYear}
        rangerDistrict={props.rangerDistrict}
        selectedState={selectedState}
        setCounty={setCounty}
        setPredictionYear={() => {}}
        setRangerDistrict={setRangerDistrict}
        setState={setState}
        clearAllSelections={props.clearAllSelections}
        legendItems={legendItems}
        legendTitle="Total Number of Spots"
        downloadCallback={() => downloadMap(
          map,
          predictionYear,
          isDownloadingMap,
          setIsDownloadingMap,
          selectedState,
          MAP_TITLES.HISTORICAL,
          { titleDetails: { selectedState, period: predictionYear }, thresholds, colors },
        )}
        isDownloadingMap={isDownloadingMap}
        hideFilters
      />
    </div>
  );
};

export default HistoricalMap;
