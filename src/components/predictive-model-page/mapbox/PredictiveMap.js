import React, { Component } from 'react';
import '../../../styles/predictive-model-page/PredictiveMap.css';
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
require('dotenv').config() // load mapbox access token

class PredictiveMap extends Component {
    constructor(props) {
        super(props)
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

        this.state = {
            map: null,
            dataController: null,
            dataControllerState: null,
            thresholds: ['0-10%', '10-20%', '20-30%', '30-40%', '40-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'],
            colors: ['#FFF072', '#FFD850', '#FFA930', '#FF7B21', '#FF2000', '#F00000', '#CA000E', '#880021', '#560019', '#000000'],
            legendTags: [],
            hoverElement: <p>{"Hover over a forest for detailed information"}</p>
        }

        this.createMap = this.createMap.bind(this);
        this.updateChoroplethLayer = this.updateChoroplethLayer.bind(this);
        this.colorStates = this.colorStates.bind(this);
    }
    render() {
        return(
            <div className="map-container flex-item-left">
                <div id="map"></div>
                <div className='map-overlay-hover-area' id='features'>
                    <h3>Predictions Per Forest</h3>
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
                    style: 'mapbox://styles/mapbox/streets-v9',
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
                    }    
                    // disable map zoom when using scroll
                    this.state.map.scrollZoom.disable();

                    var legendTags = []

                    // add legend tags
                    for (var i = 0; i < this.state.thresholds.length; i++) {
                        var layer = this.state.thresholds[i];
                        var color = this.state.colors[i];
                        var element = <div key={i} >
                                <span className="legend-key" style={{backgroundColor: color}}></span>
                                <span>{layer}</span>
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
                        this.state.map.on('click', 'states-join', function (e) {
                            this.state.dataController.updateStateSelection(e.features[0].properties.STATE_ID)
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
                        url: "mapbox://pine-beetle-prediction.0tor8eeq"
                    });
                }

                if (this.state.map.getSource("states") === undefined) {
                    // Add source for state polygons hosted on Mapbox, based on US Census Data:
                    // https://www.census.gov/geo/maps-data/data/cbf/cbf_state.html
                    this.state.map.addSource("states", {
                        type: "vector",
                        url: "mapbox://mapbox.us_census_states_2015"
                    });

                    this.state.map.addLayer({
                        "id": "states-join",
                        "type": "fill",
                        "source": "states",
                        "source-layer": "states",
                        'paint': {
                            'fill-opacity': 0
                        },
                    }, 'waterway-label');
                }

                this.colorStates();
            }.bind(this));
        }
        else if(this.state.map.isStyleLoaded()) {
            this.colorStates();
        } 
    }

    colorStates() {
        // remove forests-join layer if already constructed
        var mapLayer = this.state.map.getLayer('forests-join');
        if (typeof mapLayer !== 'undefined') {
            this.state.map.removeLayer("forests-join");
            this.state.map.removeSource("forests");

            this.state.map.addSource("forests", {
                type: "vector",
                url: "mapbox://pine-beetle-prediction.0tor8eeq"
            });
        }

        if (this.state.dataControllerState.predictiveModelOutputArray.length > 0) {
            // define expression for computing choropleth colors
            // var expression = ["all", ["match", ["get", "stateCode"]], ["match", ["get", "forestCode"]]]
            // var expression = ["match", ["get", "forest"]];

            var expression = ["match", ["upcase", ["get", "forest"]]];
            var forestsAdded = []

            // calculate color for each state based on clerids
            this.state.dataControllerState.predictiveModelOutputArray.forEach(function(row) {
                let color;

                if (row.outputs["prob53spots"] >= 0.0 && row.outputs["prob53spots"] <= 0.10) {
                    color = this.state.colors[0]
                }
                else if (row.outputs["prob53spots"] > 0.10 && row.outputs["prob53spots"] <= 0.20) {
                    color = this.state.colors[1]
                }
                else if (row.outputs["prob53spots"] > 0.20 && row.outputs["prob53spots"] <= 0.30) {
                    color = this.state.colors[2]
                }
                else if (row.outputs["prob53spots"] > 0.30 && row.outputs["prob53spots"] <= 0.40) {
                    color = this.state.colors[3]
                }
                else if (row.outputs["prob53spots"] > 0.40 && row.outputs["prob53spots"] <= 0.50) {
                    color = this.state.colors[4]
                }
                else if (row.outputs["prob53spots"] > 0.50 && row.outputs["prob53spots"] <= 0.60) {
                    color = this.state.colors[5]
                }
                else if (row.outputs["prob53spots"] > 0.60 && row.outputs["prob53spots"] <= 0.70) {
                    color = this.state.colors[6]
                }
                else if (row.outputs["prob53spots"] > 0.70 && row.outputs["prob53spots"] <= 0.80) {
                    color = this.state.colors[7]
                }
                else if (row.outputs["prob53spots"] > 0.80 && row.outputs["prob53spots"] <= 0.90) {
                    color = this.state.colors[8]
                }
                else if (row.outputs["prob53spots"] > 0.90) {
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
                "source-layer": "RD_SPB_NE",
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
                var mapLayer = this.state.map.getLayer('forests-join');
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
            var mapLayer = this.state.map.getLayer('forests-join');
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

export default PredictiveMap
