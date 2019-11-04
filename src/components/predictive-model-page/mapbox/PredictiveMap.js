import React, { Component } from 'react';
import '../../../styles/predictive-model-page/PredictiveMap.css';
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
var printPdf = require('mapbox-print-pdf');
require('dotenv').config() // load mapbox access token

class PredictiveMap extends Component {
    constructor(props) {
        super(props)
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

        this.state = {
            map: null,
            dataController: null,
            dataControllerState: null,
            thresholds: ['0%', '0.1%-2%', '2.1%-3%', '3.1%-5%', '5.1%-8%', '8.1%-13%', '13.1%-22%', '22.1%-36%', '36.1%-60%', '60.1%-100%'],
            colors: ['#4776b3', '#6F90B6', '#9AAEBC', '#C0CCBE', '#E9ECC0', '#FEE8B0', '#F9B988', '#F08D66', '#E46149', '#D4312E'],
            legendTags: [],
            hoverElement: <p>{"Hover over a forest for detailed information"}</p>
        }

        this.createMap = this.createMap.bind(this);
        this.downloadMap = this.downloadMap.bind(this);
        this.updateChoroplethLayer = this.updateChoroplethLayer.bind(this);
        this.colorStates = this.colorStates.bind(this);
        this.returnMapName = this.returnMapName.bind(this);
        this.buildFooter = this.buildFooter.bind(this);
        this.buildHeader = this.buildHeader.bind(this);
        this.printMap = this.buildPrintMap.bind(this);
    }

    render() {
        return(
            <div className="container flex-item-left" id="map-container">
                <div id="map"></div>
                <div className='map-overlay-hover-area' id='features'>
                    <h3>Predictions By Forest</h3>
                    <div id='pd'>
                        {this.state.hoverElement}
                    </div>
                </div>
                <div className='map-overlay-legend' id='legend'>
                    {this.state.legendTags}
                </div>
            </div>
        );
    }

    componentWillMount() {
        this.updateStateFromProps(this.props);
    }

    componentDidMount() {
        this.updateStateFromProps(this.props);
        
        document.addEventListener('click', (event) => {
            if (!event.target.matches('.download-button')) return;
            this.downloadMap();
        }, false);

        document.addEventListener('click', (event) => {
            if (!event.target.matches('.download-button p')) return;
            this.downloadMap();
        }, false);
    }

    // if receiving new data, update the state
    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    updateStateFromProps(props) {   
        this.setState({
            dataController: props.dataController,
            dataControllerState: props.dataControllerState
        }, () => {
            if (this.state.dataControllerState.historicalData.summarizedDataByState !== null) {
                if (this.state.map === null) {
                    this.createMap();
                }
                else {
                    this.updateChoroplethLayer();
                }
            }
        })
    }

    createMap() {
        if (this.state.map === null) {
            this.setState({
                map: new mapboxgl.Map({
                    container: 'map', // container id
                    // style: 'mapbox://styles/mapbox/streets-v9',
                    style: 'mapbox://styles/pine-beetle-prediction/ck2kl9kcy4vvb1cjyf23s2ars',
                    center: [-84.3880,33.7490], // starting position
                    zoom: 4.8, // starting zoom
                    options: {
                        trackResize: true
                    }
                })
            }, () => {
                if (this.state.map !== null && this.state.map._controls !== undefined) {
                    // if we haven't added a navigation control, add one
                    if (this.state.map._controls.length < 3) {
                        // Add zoom and rotation controls to the map.
                        this.state.map.addControl(new mapboxgl.NavigationControl());
                        this.state.map.addControl(new DownloadControl(), 'bottom-left');
                    }

                    // disable map zoom when using scroll
                    this.state.map.scrollZoom.disable();

                    var legendTags = []

                    // add legend tags
                    for (var i = 0; i < this.state.thresholds.length; i++) {
                        var layer = this.state.thresholds[i];
                        var color = this.state.colors[i];
                        var element = <div key={i} >
                                <span>{layer}</span>
                                <span className="legend-key" style={{backgroundColor: color}}></span>
                            </div>

                        legendTags.push(element)
                    }

                    this.setState({
                        legendTags: legendTags
                    });

                    if (this.state.map._listeners.mousemove === undefined) {
                        this.state.map.on('mousemove', function(e) {
                            if (this.state.map !== null) {
                                var forests = this.state.map.queryRenderedFeatures(e.point, {
                                    layers: ['forests-join']
                                });
        
                                let element;
        
                                if (forests.length > 0) {
                                    // get prediction for this state
                                    var probability = 0;
                                    for (var entry in this.state.dataControllerState.predictiveModelOutputArray) {
                                        var check = this.state.dataControllerState.predictiveModelOutputArray[entry].inputs.forest;

                                        if (check === forests[0].properties.forest.toUpperCase()) {
                                            probability = this.state.dataControllerState.predictiveModelOutputArray[entry].outputs.prob53spots;
                                        }
                                    }
                                    element = <div id="choropleth-map-p-area">
                                                <p><strong>{forests[0].properties.forest}</strong></p>
                                                <p>{probability*100 + "%"}</p>
                                            </div> 
                                }
                                else {
                                    element = <p>{"Hover over a forest for detailed information"}</p> 
                                }
        
                                this.setState({
                                    hoverElement: element
                                });
                            }   
                        }.bind(this));

                        // select state when user clicks on it
                        this.state.map.on('click', 'forests-join', function (e) {
                            this.state.dataController.updateForestSelection(e.features[0].properties.forest.toUpperCase())
                        }.bind(this));
                    }

                    this.updateChoroplethLayer();
                }
            });
        }
        else {
            this.updateChoroplethLayer();
        }
    }

    updateChoroplethLayer() {  
        this.state.map.resize();

        if (this.state.map._listeners.load === undefined) {
            this.state.map.on('load', function() {
                if (this.state.map.getSource("forests") === undefined) {
                    this.state.map.addSource("forests", {
                        type: "vector",
                        url: "mapbox://pine-beetle-prediction.1be58pyi"
                    });
                }

                this.colorStates();
            }.bind(this));
        }
        else if(this.state.map.isStyleLoaded()) {
            this.colorStates();
        } 
    }

    returnMapName() {
        return(`${this.state.dataControllerState.userFilters.stateName}${this.state.dataControllerState.userFilters.predictiveModelDate}`);
    }

    buildFooter() {
        var title = `Southern  Pine  Beetle  Outbreak  Prediction  Maps:  ${this.state.dataControllerState.userFilters.stateName}  ${this.state.dataControllerState.userFilters.predictiveModelDate}`;
        var legendString = "";
        for (var i = 0; i < this.state.thresholds.length; i++) {
            var layer = this.state.thresholds[i];
            var color = this.state.colors[i];
            var spanString = `<div class="footer-legend-key" style="background: ${color};"></div><span>${layer}</span>`;
            legendString = legendString.concat(spanString);
        }
        return(
            `<div id="map-footer">
                <div id='footer-legend'>
                    ${legendString}
                </div>
                <p class="footnote" >Note: Color ramp is scaled to emphasize the lower values; 
                the midpoint colors indicate probability values between 8% and 20%.</p>
                <div id="spacer"></div>
                <h2>${title}</h2>
                <p>The outbreak prediction model is based on a number of predictor variables that were 
                determined to provide the best fit to the data. Most prominent among the driving variables 
                were number of SPB/two week time period, and number of spots last year.
                </p>
                <p>
                The SPB prediction project is supported by USDA Forest Service: Science and Technology 
                Development Program (STDP)
                </p>
                <p>Contact: Matthew P. Ayres - matthew.p.ayres@dartmouth.edu; Carissa F. Aoki - carissa.f.aoki@dartmouth.edu
                </p>
                <p class="footnote">Sources: Esri, HERE, Garmin, Intermap, increment P Corp., GEBCO, USGS,FAO, NPS, NRCAN, 
                GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), swisstopo, © OpenStreetMap 
                contributors, andthe GIS User Community</p>
            </div>`
        );
    }

    buildHeader() {
        return(
            `<div id="map-header">
                <h2>Probability of (Any) Spots</h2>
            </div>`
        );
    }

    buildPrintMap() {
        console.log("maping")
        var printMap = this.state.map;
       
        printMap.addSource("counties", {
            type: "vector",
            url: "mapbox://pine-beetle-prediction.6ag6fs2a"
        });

        printMap.addLayer({
            "id": "county-label",
            "type": "symbol",
            "source": "counties",
            "source-layer": "counties_for_labels-dlcufl",
            "layout": {
                "text-font": ["Open Sans Regular"],
                "text-field": '{County [2]}',
                "text-size": 12
              }
        }, 'waterway-label');

        return printMap;
    }

    // function to download map of currently selected data
    // connected to the onClick of the .download-button class
    downloadMap() {
        var mapName = this.returnMapName();
        var printMap = this.buildPrintMap();

        printPdf.build()
        .header({
            html: this.buildHeader(),
            baseline: {format: 'a3', orientation: 'p'}
        })
        .footer({
            html: this.buildFooter(),
            baseline: {format: 'a3', orientation: 'p'}
        })
        .margins({
            top: 8,
            right: 8,
            left: 8,
            bottom: 8
          }, "pt")
        .format('a3')
        .portrait() 
        .print(printMap, mapboxgl)
        .then(function(pdf) {
          pdf.save(mapName);
        });
    }

    colorStates() {
        // remove forests-join layer if already constructed
        var mapLayer = this.state.map.getLayer('forests-join');
        if (typeof mapLayer !== 'undefined') {
            this.state.map.removeLayer("forests-join");
            this.state.map.removeSource("forests");

            this.state.map.addSource("forests", {
                type: "vector",
                url: "mapbox://pine-beetle-prediction.1be58pyi"
            });
        }

        this.state.map.setLayoutProperty('county-labels', 'visibility', 'none');

        if (this.state.dataControllerState.predictiveModelOutputArray.length > 0) {
            var expression = ["match", ["upcase", ["get", "forest"]]];
            var forestsAdded = []

            // calculate color for each state based on clerids
            this.state.dataControllerState.predictiveModelOutputArray.forEach(function(row) {
                let color;

                if (row.outputs["prob53spots"] <= 0.010 ) {
                    color = this.state.colors[0]
                }
                else if (row.outputs["prob53spots"] > 0.010 && row.outputs["prob53spots"] <= 0.017) {
                    color = this.state.colors[1]
                }
                else if (row.outputs["prob53spots"] > 0.017 && row.outputs["prob53spots"] <= 0.028) {
                    color = this.state.colors[2]
                }
                else if (row.outputs["prob53spots"] > 0.028 && row.outputs["prob53spots"] <= 0.046) {
                    color = this.state.colors[3]
                }
                else if (row.outputs["prob53spots"] > 0.046 && row.outputs["prob53spots"] <= 0.077) {
                    color = this.state.colors[4]
                } 
                else if (row.outputs["prob53spots"] > 0.077 && row.outputs["prob53spots"] <= 0.129) {
                    color = this.state.colors[5]
                }
                else if (row.outputs["prob53spots"] > 0.129 && row.outputs["prob53spots"] <= 0.215) {
                    color = this.state.colors[6]
                }
                else if (row.outputs["prob53spots"] > 0.215 && row.outputs["prob53spots"] <= 0.359) {
                    color = this.state.colors[7]
                }
                else if (row.outputs["prob53spots"] > 0.359 && row.outputs["prob53spots"] <= 0.599) {
                    color = this.state.colors[8]
                }
                else if (row.outputs["prob53spots"] > 0.599) {
                    color = this.state.colors[9]
                } 

                if (!forestsAdded.includes(row.inputs["forest"])) {
                    expression.push(row.inputs["forest"], color);
                    forestsAdded.push(row.inputs["forest"]);
                }

            }.bind(this));

            // last value is the default, used where there is no data
            expression.push("rgba(0,0,0,0)");

            // add layer from the vector tile source with data-driven style
            this.state.map.addLayer({
                "id": "forests-join",
                "type": "fill",
                "source": "forests",
                "source-layer": "US_Counties_updated",
                "paint": {
                    "fill-color": expression
                }
            }, 'waterway-label');

            if (this.state.dataControllerState.userFilters.stateAbbreviation !== null) {
                var center = this.state.dataControllerState.stateToZoomLevel[this.state.dataControllerState.userFilters.stateAbbreviation][0];
                var zoom = this.state.dataControllerState.stateToZoomLevel[this.state.dataControllerState.userFilters.stateAbbreviation][1];

                this.state.map.flyTo({
                    center: center,
                    zoom: zoom
                });
            }
            else {
                mapLayer = this.state.map.getLayer('forests-join');
                if (typeof mapLayer !== 'undefined') {
                    this.state.map.removeLayer("forests-join");
                }

                this.state.map.flyTo({
                    center: [-84.3880,33.7490],
                    zoom: 4.8
                });
            }
        }
        else {
            mapLayer = this.state.map.getLayer('forests-join');
            if (typeof mapLayer !== 'undefined') {
                this.state.map.removeLayer("forests-join");
            }

            this.state.map.flyTo({
                center: [-84.3880,33.7490],
                zoom: 4.8
            });
        }
    }
}

class DownloadControl {
    onAdd(map){
        this.map = map;
        this.container = document.createElement('div');
        this.container.className = 'download-button mapboxgl-ctrl';
        this.container.innerHTML =  '<p>Download</p>';
        return this.container;
    }
    
    onRemove(){
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
} 

export default PredictiveMap

