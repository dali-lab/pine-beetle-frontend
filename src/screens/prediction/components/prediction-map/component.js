/* eslint-disable prefer-destructuring */
import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import { stateAbbrevToZoomLevel, DATA_MODES } from '../../../../constants';
// import printPdf from 'mapbox-print-pdf';

import {
  separatePascalCase,
} from '../../../../utils';

import './style.scss';

const thresholds = ['0-2.5%', '2.5-5%', '5-15%', '15-25%', '25-40%', '40-100%'];
const colors = ['#86CCFF', '#FFC148', '#FFA370', '#FF525C', '#CB4767', '#6B1B38'];

const MAP_SOURCES = {
  COUNTY: {
    type: 'vector',
    url: 'mapbox://pine-beetle-prediction.1be58pyi',
  },
  RANGER_DISTRICT: {
    type: 'vector',
    url: 'mapbox://pine-beetle-prediction.0tor8eeq',
  },
};

const SOURCE_LAYERS = {
  COUNTY: 'US_Counties_updated',
  RANGER_DISTRICT: 'RD_SPB_NE',
};

const MAP_SOURCE_NAME = 'counties';
const VECTOR_LAYER = 'prediction-chloropleth-layer';

class DownloadControl {
  onAdd(map) {
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = 'download-button mapboxgl-ctrl';
    this.container.innerHTML = '<p>Download</p>';
    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}

const PredictionMap = (props) => {
  const {
    allRangerDistricts,
    dataMode,
    predictionsData,
    selectedState,
    setCounty,
    setRangerDistrict,
    setState,
    year,
  } = props;

  const [map, setMap] = useState();
  const [initialFill, setInitialFill] = useState(false);
  const [legendTags, setLegendTags] = useState([]);
  const [predictionHover, setPredictionHover] = useState(null);

  const mapboxHoverStyle = (x, y) => {
    if (x < 300 && y < 200) {
      return ({ left: `${x}px`, top: `${y}px` });
    } else if (y < 200) {
      return ({ left: `${x - 280}px`, top: `${y}px` });
    } else if (x < 300) {
      return ({ left: `${x}px`, top: `${y - 125}px` });
    } else {
      return ({ left: `${x - 280}px`, top: `${y - 125}px` });
    }
  };

  // twice-curried function for generating hover callback
  const createMapHoverCallback = (predictions, rangerDistricts, mode) => (e) => {
    if (!map) return;

    const counties = map.queryRenderedFeatures(e.point, {
      layers: [VECTOR_LAYER],
    });

    if (counties.length > 0 && counties[0] && counties[0].properties && counties[0].properties.forest) {
      const { x, y } = e.point;

      let location;

      if (mode === DATA_MODES.COUNTY) {
        location = counties[0].properties.forest.slice(0, -3);
      } else {
        location = rangerDistricts.find(rd => rd.includes(counties[0].properties.forest.replaceAll(' ', '')));
      }

      const pred = predictions.find((p) => {
        return (p.county === location && mode === DATA_MODES.COUNTY)
        || (p.rangerDistrict === location && mode === DATA_MODES.RANGER_DISTRICT);
      });

      if (pred && x && y) {
        const {
          county: countyName,
          prediction: {
            'prob.Spots>0': probAny,
            'prob.Spots>53': probOutbreak,
          },
        } = pred;

        setPredictionHover((
          <div id="prediction-hover" style={mapboxHoverStyle(x, y)}>
            <h3>{dataMode === DATA_MODES.COUNTY ? `${countyName} County` : `${counties[0].properties.forest.slice(0, -3)} Ranger District`}</h3>
            <p>Probability of any spots: {probAny.toFixed(2)}%</p>
            <p>Probability of an outbreak: {probOutbreak.toFixed(2)}%</p>
          </div>
        ));
      } else {
        setPredictionHover(null);
      }
    }
  };

  // twice-curried function for generating click callback
  const createMapClickCallback = rangerDistricts => (e) => {
    const {
      forest: _forest,
      STATE: _state,
    } = e.features[0].properties;

    const forest = _forest.slice(0, -3);

    if (!selectedState) {
      setState(_state);
    }

    if (dataMode === DATA_MODES.COUNTY) {
      setCounty(forest);
    } else {
      setRangerDistrict(rangerDistricts.find(district => (
        district.includes(forest.replace(' ', ''))
      )));
    }
  };

  const generateMap = (forceRegenerate) => {
    if (map && !forceRegenerate) return;

    const createdMap = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/pine-beetle-prediction/ckgrzijos0q5119paazko291z',
      center: [-84.3880, 33.7490], // starting position
      zoom: 4.8, // starting zoom
      options: {
        trackResize: true,
      },
    });

    if (!createdMap._controls) return;

    // if we haven't added a navigation control, add one
    if (createdMap._controls.length < 3) {
      createdMap.addControl(new mapboxgl.NavigationControl());
      createdMap.addControl(new DownloadControl(), 'bottom-left'); // adds download button to map
    }

    // disable map zoom when using scroll
    createdMap.scrollZoom.disable();

    const legendTagsToSet = thresholds.map((threshold, index) => {
      const color = colors[index];

      return (
        <div key={color}>
          <span>{threshold}</span>
          <span className="legend-key" style={{ backgroundColor: color }} />
        </div>
      );
    });

    // add legend tags
    setLegendTags(legendTagsToSet);

    // add map source on load
    if (!createdMap._listeners.load) {
      createdMap.on('load', () => {
        if (!createdMap.getSource(MAP_SOURCE_NAME)) {
          createdMap.addSource(MAP_SOURCE_NAME, dataMode === DATA_MODES.COUNTY ? MAP_SOURCES.COUNTY : MAP_SOURCES.RANGER_DISTRICT);
          console.log(createdMap.getSource(MAP_SOURCE_NAME));
        }
      });
    }

    // select county/RD when user clicks on it
    if (!createdMap._listeners.click) {
      createdMap.on('click', VECTOR_LAYER, createMapClickCallback(allRangerDistricts));
    }

    if (createdMap._listeners.mousemove === undefined) {
      createdMap.on('mousemove', createMapHoverCallback(predictionsData, allRangerDistricts, dataMode));
    }

    setMap(createdMap);
  };

  const colorPredictions = (predictions) => {
    // keep trying until map styles are loaded
    if (!map.isStyleLoaded()) {
      setTimeout(() => {
        colorPredictions(predictions);
      }, 1000);

      return;
    }

    // remove county layer if already constructed
    if (map.getLayer(VECTOR_LAYER)) {
      map.removeLayer(VECTOR_LAYER);
    }

    const fillExpression = ['match', ['upcase', ['get', 'forest']]];
    const strokeExpression = ['match', ['upcase', ['get', 'forest']]];

    predictions.forEach(({
      county,
      prediction,
      rangerDistrict,
      state,
    }) => {
      const fillProb = prediction['prob.Spots>53'];

      let color;

      if (fillProb <= 0.025) {
        color = colors[0];
      } else if (fillProb > 0.025 && fillProb <= 0.05) {
        color = colors[1];
      } else if (fillProb > 0.05 && fillProb <= 0.15) {
        color = colors[2];
      } else if (fillProb > 0.15 && fillProb <= 0.25) {
        color = colors[3];
      } else if (fillProb > 0.25 && fillProb <= 0.4) {
        color = colors[4];
      } else {
        color = colors[5];
      }

      const countyFormatName = county && state ? `${county.toUpperCase()} ${state}` : '';
      const rangerDistrictFormatName = rangerDistrict ? separatePascalCase(rangerDistrict.split('_').pop()).toUpperCase() : '';

      const locationName = dataMode === DATA_MODES.COUNTY
        ? countyFormatName
        // handles case where tileset has two spaces instead of one (this is a one-off)
        : [rangerDistrictFormatName, rangerDistrictFormatName.replace(' RD', '  RD')];

      fillExpression.push(locationName, color);
      strokeExpression.push(locationName, '#000000');
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

  // function to download map of currently selected data
  // connected to the onClick of the .download-button class
  const downloadMap = () => {
    // var mapName = this.returnMapName();
    // var printMap = this.buildPrintMap();

    // printPdf.build()
    // .header({
    //     html: this.buildHeader(),
    //     baseline: {format: 'a3', orientation: 'p'}
    // })
    // .footer({
    //     html: this.buildFooter(),
    //     baseline: {format: 'a3', orientation: 'p'}
    // })
    // .margins({
    //     top: 8,
    //     right: 8,
    //     left: 8,
    //     bottom: 8
    //   }, "pt")
    // .format('a3')
    // .portrait()
    // .print(printMap, mapboxgl)
    // .then(function(pdf) {
    //   pdf.save(mapName);
    //   // after saving, undo the design changes made by buildPrintMap()
    //   // so they do not persist on the map shown on the website
    //   printMap.removeLayer("county-label");
    //   printMap.setLayoutProperty("settlement-label", "visibility", "visible");
    //   printMap.setPaintProperty("admin-1-boundary", "line-width", 0.75);
    // });
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

    setTimeout(() => {
      setMap(undefined);
      generateMap(true);

      // Calls function to download map when download control is clicked
      document.addEventListener('click', (event) => {
        if (!event.target.matches('.download-button')) return;
        downloadMap();
      }, false);

      // Calls function to download map when download control is clicked
      document.addEventListener('click', (event) => {
        if (!event.target.matches('.download-button p')) return;
        downloadMap();
      }, false);
    }, 100);
  }, [dataMode]);

  useEffect(() => {
    if (!map) return;

    if (year.toString().length === 4 && predictionsData.length > 0) colorPredictions(predictionsData);

    if (selectedState) {
      const zoom = stateAbbrevToZoomLevel[selectedState];

      map.flyTo({
        center: zoom[0],
        zoom: zoom[1],
      });
    } else {
      map.flyTo({
        center: [-84.3880, 33.7490],
        zoom: 4.8,
      });
    }
  }, [predictionsData, selectedState, map]);

  useEffect(() => {
    if (!initialFill && map && predictionsData.length > 0) {
      colorPredictions(predictionsData);
      setInitialFill(true);
    }

    if (map && predictionsData) {
      map.on('mousemove', createMapHoverCallback(predictionsData, allRangerDistricts, dataMode));
    }
  }, [map, predictionsData, allRangerDistricts, dataMode]);

  useEffect(() => {
    if (map && allRangerDistricts) {
      map.on('click', VECTOR_LAYER, createMapClickCallback(allRangerDistricts));
    }
  }, [map, allRangerDistricts]);

  return (
    <div className="container flex-item-left" id="map-container">
      <div id="map" />
      <div className="map-overlay-legend" id="legend">
        <div className="legend-key-title"><strong>Probability of &gt;50 spots</strong></div>
        {legendTags}
      </div>
      <div id="printmap" />
      {predictionHover}
    </div>
  );
};

export default PredictionMap;
