import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import { stateAbbrevToZoomLevel } from '../../../../constants';
// import printPdf from 'mapbox-print-pdf';

import './style.scss';

const thresholds = ['0-1%', '1-5%', '5-10%', '10-30%', '30-60%', '60-100%'];
const colors = ['#86CCFF', '#FFC148', '#FFA370', '#FF525C', '#CB4767', '#6B1B38'];

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
    selectedState,
  } = props;

  const [map, setMap] = useState();
  const [legendTags, setLegendTags] = useState([]);
  const [hoverElement, setHoverElement] = useState(<p>Hover over a forest for detailed information</p>);

  const generateMap = () => {
    if (map) return;

    const createdMap = new mapboxgl.Map({
      container: 'map', // container id
      // style: 'mapbox://styles/mapbox/streets-v9',
      // style: 'mapbox://styles/pine-beetle-prediction/ck2kl9kcy4vvb1cjyf23s2ars',
      style: 'mapbox://styles/barkincavdaroglu/ckfx27xrv02k519mhahinwsni',
      center: [-84.3880, 33.7490], // starting position
      zoom: 4.8, // starting zoom
      options: {
        trackResize: true,
      },
    });

    if (createdMap._controls) {
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

      if (createdMap._listeners.mousemove === undefined) {
        createdMap.on('mousemove', (e) => {
          if (!createdMap) return;

          const counties = createdMap.queryRenderedFeatures(e.point, {
            layers: ['counties-join'],
          });

          let element;

          if (counties.length > 0) {
            // get prediction for this state
            const probability = 0;
            // for (const entry in this.state.dataControllerState.predictiveModelOutputArray) {
            //   const check = this.state.dataControllerState.predictiveModelOutputArray[entry].inputs.forest;

            //   if (check === counties[0].properties.forest.toUpperCase()) {
            //     probability = this.state.dataControllerState.predictiveModelOutputArray[entry].outputs.prob53spots;
            //   }
            // }
            element = (
              <div id="choropleth-map-p-area">
                <p><strong>{counties[0].properties.forest}</strong></p>
                <p>{`${probability * 100}%`}</p>
              </div>
            );
          } else {
            element = <p>Hover over a forest for detailed information</p>;
          }

          setHoverElement(element);
        });

        // select forest when user clicks on it
        createdMap.on('click', 'counties-join', (e) => {
          const forest = e.features[0].properties.forest.toUpperCase();

          console.log(forest);

          // TODO: select forest/county/ranger district in redux selections store
          // this.state.dataController.updatecountieselection(e.features[0].properties.forest.toUpperCase());
        });
      }

      setMap(createdMap);
    }
  };

  const colorState = (selectedSt) => {
    // remove counties-join layer if already constructed
    const mapLayer = map.getLayer('counties-join');

    if (mapLayer) {
      map.removeLayer('counties-join');
      map.removeSource('counties');

      map.addSource('counties', {
        type: 'vector',
        url: 'mapbox://pine-beetle-prediction.1be58pyi',
      });
    }

    console.log(selectedSt);
    console.log(mapLayer);


    // if (this.state.dataControllerState.predictiveModelOutputArray.length > 0) {
    //   const expression = ['match', ['upcase', ['get', 'forest']]];
    //   const countiesAdded = [];

    //   // calculate color for each state based on clerids
    //   this.state.dataControllerState.predictiveModelOutputArray.forEach((row) => {
    //     let color;

    //     if (row.outputs.prob53spots <= 0.010) {
    //       color = colors[0];
    //     } else if (row.outputs.prob53spots > 0.010 && row.outputs.prob53spots <= 0.017) {
    //       color = colors[1];
    //     } else if (row.outputs.prob53spots > 0.017 && row.outputs.prob53spots <= 0.028) {
    //       color = colors[2];
    //     } else if (row.outputs.prob53spots > 0.028 && row.outputs.prob53spots <= 0.046) {
    //       color = colors[3];
    //     } else if (row.outputs.prob53spots > 0.046 && row.outputs.prob53spots <= 0.077) {
    //       color = colors[4];
    //     } else if (row.outputs.prob53spots > 0.077 && row.outputs.prob53spots <= 0.129) {
    //       color = colors[5];
    //     } else if (row.outputs.prob53spots > 0.129 && row.outputs.prob53spots <= 0.215) {
    //       color = colors[6];
    //     } else if (row.outputs.prob53spots > 0.215 && row.outputs.prob53spots <= 0.359) {
    //       color = colors[7];
    //     } else if (row.outputs.prob53spots > 0.359 && row.outputs.prob53spots <= 0.599) {
    //       color = colors[8];
    //     } else if (row.outputs.prob53spots > 0.599) {
    //       color = colors[9];
    //     }

    //     if (!countiesAdded.includes(row.inputs.forest)) {
    //       expression.push(row.inputs.forest, color);
    //       countiesAdded.push(row.inputs.forest);
    //     }
    //   });

    //   // last value is the default, used where there is no data
    //   expression.push('rgba(0,0,0,0)');

    //   // add layer from the vector tile source with data-driven style
    //   map.addLayer({
    //     id: 'counties-join',
    //     type: 'fill',
    //     source: 'counties',
    //     'source-layer': 'US_Counties_updated',
    //     paint: {
    //       'fill-color': expression,
    //     },
    //   }, 'national-park');

    //   if (this.state.dataControllerState.userFilters.stateAbbreviation !== null) {
    //     const center = this.state.dataControllerState.stateToZoomLevel[this.state.dataControllerState.userFilters.stateAbbreviation][0];
    //     const zoom = this.state.dataControllerState.stateToZoomLevel[this.state.dataControllerState.userFilters.stateAbbreviation][1];

    //     map.flyTo({
    //       center,
    //       zoom,
    //     });
    //   } else {
    //     mapLayer = map.getLayer('counties-join');
    //     if (typeof mapLayer !== 'undefined') {
    //       map.removeLayer('counties-join');
    //     }

    //     map.flyTo({
    //       center: [-84.3880, 33.7490],
    //       zoom: 4.8,
    //     });
    //   }
    // } else {
    //   mapLayer = map.getLayer('counties-join');
    //   if (mapLayer) {
    //     map.removeLayer('counties-join');
    //   }

    //   map.flyTo({
    //     center: [-84.3880, 33.7490],
    //     zoom: 4.8,
    //   });
    // }
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
  }, []);

  // useEffect(() => {
  //   if (!map) return;

  //   map.resize();

  //   if (map._listeners.load === undefined) {
  //     map.on('load', () => {
  //       if (map.getSource('counties') === undefined) {
  //         map.addSource('counties', {
  //           type: 'vector',
  //           url: 'mapbox://pine-beetle-prediction.1be58pyi',
  //         });
  //       }

  //       colorStates();
  //     });
  //   } else if (map.isStyleLoaded()) {
  //     colorStates();
  //   }
  // }, [map]);

  useEffect(() => {
    if (map && selectedState) {
      const zoom = stateAbbrevToZoomLevel[selectedState];
      map.flyTo({
        center: zoom[0],
        zoom: zoom[1],
      });
      colorState(selectedState);
    } else if (map) {
      map.flyTo({
        center: [-84.3880, 33.7490],
        zoom: 4.8,
      });
      // TODO: uncolor state after zoom out
    }
  }, [selectedState]);

  return (
    <div className="container flex-item-left" id="map-container">
      <div id="map" />
      <div className="map-overlay-hover-area" id="features">
        <h3>Predictions By Forest</h3>
        <div id="pd">
          {hoverElement}
        </div>
      </div>
      <div className="map-overlay-legend" id="legend">
        <div className="legend-key-title"><strong>Probability of &gt;50 spots</strong></div>
        {legendTags}
      </div>
      <div id="printmap" />
    </div>
  );
};

export default PredictionMap;
