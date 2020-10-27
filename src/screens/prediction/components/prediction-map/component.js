/* eslint-disable prefer-destructuring */
import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import { stateAbbrevToZoomLevel, DATA_MODES } from '../../../../constants';
// import printPdf from 'mapbox-print-pdf';

import './style.scss';

const thresholds = ['0-2.5%', '2.5-5%', '5-15%', '15-25%', '25-40%', '40-100%'];
const colors = ['#86CCFF', '#FFC148', '#FFA370', '#FF525C', '#CB4767', '#6B1B38'];

const MAP_SOURCE = {
  type: 'vector',
  url: 'mapbox://pine-beetle-prediction.1be58pyi',
};

const MAP_SOURCE_NAME = 'counties';
const SOURCE_LAYER = 'US_Counties_updated';
const VECTOR_LAYER = 'us-counties-updated';

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
    dataMode,
    predictionsData,
    selectedState,
    setCounty,
    year,
  } = props;

  const [map, setMap] = useState();
  const [initialFill, setInitialFill] = useState(false);
  const [legendTags, setLegendTags] = useState([]);

  const generateMap = () => {
    if (map) return;

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
          createdMap.addSource(MAP_SOURCE_NAME, MAP_SOURCE);
        }
      });
    }

    // select county/RD when user clicks on it
    if (!createdMap._listeners.click) {
      createdMap.on('click', VECTOR_LAYER, (e) => {
        const forest = e.features[0].properties.forest.slice(0, -3);
        setCounty(forest);
      });
    }

    if (createdMap._listeners.mousemove === undefined) {
      createdMap.on('mousemove', (e) => {
        if (!createdMap) return;

        const counties = createdMap.queryRenderedFeatures(e.point, {
          layers: [VECTOR_LAYER],
        });

        if (counties.length > 0) {
          console.log(counties[0].properties.forest);
        }
      });
    }

    setMap(createdMap);
  };

  const colorPredictions = () => {
    if (!map.isStyleLoaded()) return;

    // remove county layer if already constructed
    if (map.getLayer(VECTOR_LAYER)) {
      map.removeLayer(VECTOR_LAYER);
    }

    const fillExpression = ['match', ['upcase', ['get', 'forest']]];
    const strokeExpression = ['match', ['upcase', ['get', 'forest']]];

    predictionsData.forEach(({
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

      // TODO: might need to use different layer for ranger district
      const locationName = dataMode === DATA_MODES.COUNTY ? `${county.toUpperCase()} ${state}` : rangerDistrict;

      fillExpression.push(locationName, color);
      strokeExpression.push(locationName, '#000000');
    });

    // last value is the default, used where there is no data
    fillExpression.push('rgba(0,0,0,0)');
    strokeExpression.push('rgba(0,0,0,0)');

    // add layer from the vector tile source with data-driven style
    map.addLayer({
      id: VECTOR_LAYER,
      type: 'fill',
      source: MAP_SOURCE_NAME,
      'source-layer': SOURCE_LAYER,
      paint: {
        'fill-color': fillExpression,
        'fill-outline-color': strokeExpression,
      },
    }, 'water-point-label');
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
      generateMap();

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
  }, []);

  useEffect(() => {
    if (!map) return;

    if (year.toString().length === 4) colorPredictions();

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
      setTimeout(() => {
        colorPredictions();
        setInitialFill(true);
      }, 1000);
    }
  }, [map, predictionsData]);

  return (
    <div className="container flex-item-left" id="map-container">
      <div id="map" />
      <div className="map-overlay-legend" id="legend">
        <div className="legend-key-title"><strong>Probability of &gt;50 spots</strong></div>
        {legendTags}
      </div>
      <div id="printmap" />
    </div>
  );
};

export default PredictionMap;
