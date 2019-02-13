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
            thresholds: ['0-100', '100-250', '250-500', '500-750', '750-1,000', '1,000-2,000', '2,000-5,000', '5,000-10,000', '10,000+'],
            colors: ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026', '#4F0017'],
            legendTags: [],
            hoverElement: <p>{"Hover over a state for detailed information"}</p>
        }

        this.createMap = this.createMap.bind(this);
        this.updateChoroplethLayer = this.updateChoroplethLayer.bind(this);
        this.colorStates = this.colorStates.bind(this);
    }
    render() {
        return(
            <div className="map-container">
                <div id="map"></div>
                <div className='map-overlay' id='features'>
                    <h3>Total Spots Per State</h3>
                    <div id='pd'>
                        {this.state.hoverElement}
                    </div>
                </div>
                <div className='map-overlay' id='legend'>
                    {this.state.legendTags}
                </div>
            </div>
        );
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
                    zoom: 4.8 // starting zoom
                })
            }, () => {
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
                            var states = this.state.map.queryRenderedFeatures(e.point, {
                                layers: ['states-join']
                            });
      
                            let element;
      
                            if (states.length > 0) {
                                // get totalSpots for this state
                                var totalSpots = 0;
                                for (var entry in this.state.dataControllerState.historicalData.summarizedDataByState) {
                                    if (this.state.dataControllerState.historicalData.summarizedDataByState[entry].STATE_ID === states[0].properties.STATE_ID) {
                                        totalSpots = this.state.dataControllerState.historicalData.summarizedDataByState[entry].spots;
                                    }
                                }
                                element = <p><strong>{states[0].properties.STATE_NAME + ": "}</strong>{totalSpots + " total spots"}</p>
                            }
                            else {
                                element = <p>{"Hover over a state for detailed information"}</p> 
                            }
    
                            this.setState({
                                hoverElement: element
                            });
                        }   
                    }.bind(this));
                }

                this.updateChoroplethLayer();
            });
        }
        else {
            this.updateChoroplethLayer();
        }
    }

    updateChoroplethLayer() {  
        if (this.state.map._listeners.load === undefined) {
            this.state.map.on('load', function() {
                if (this.state.map.getSource("states") === undefined) {
                    // Add source for state polygons hosted on Mapbox, based on US Census Data:
                    // https://www.census.gov/geo/maps-data/data/cbf/cbf_state.html
                    this.state.map.addSource("states", {
                        type: "vector",
                        url: "mapbox://mapbox.us_census_states_2015"
                    });
                }

                this.colorStates();
            }.bind(this));
        }
        else if(this.state.map.isStyleLoaded()) {
            this.colorStates();
        } 
    }

    colorStates() {
        // remove states-join layer if already constructed
        var mapLayer = this.state.map.getLayer('states-join');
        if (typeof mapLayer !== 'undefined') {
            this.state.map.removeLayer("states-join");
            this.state.map.removeSource("states");

            this.state.map.addSource("states", {
                type: "vector",
                url: "mapbox://mapbox.us_census_states_2015"
            });
        }

        // define expression for computing choropleth colors
        var expression = ["match", ["get", "STATE_ID"]];

        // calculate color for each state based on clerids
        this.state.dataControllerState.historicalData.summarizedDataByState.forEach(function(row) {
            let color;

            if (row["spots"] >= 0 && row["spots"] <= 100) {
                color = this.state.colors[0]
            }
            else if (row["spots"] > 100 && row["spots"] <= 250) {
                color = this.state.colors[1]
            }
            else if (row["spots"] > 250 && row["spots"] <= 500) {
                color = this.state.colors[2]
            }
            else if (row["spots"] > 500 && row["spots"] <= 750) {
                color = this.state.colors[3]
            }
            else if (row["spots"] > 750 && row["spots"] <= 1000) {
                color = this.state.colors[4]
            }
            else if (row["spots"] > 1000 && row["spots"] <= 2500) {
                color = this.state.colors[5]
            }
            else if (row["spots"] > 2500 && row["spots"] <= 5000) {
                color = this.state.colors[6]
            }
            else if (row["spots"] > 5000 && row["spots"] <= 10000) {
                color = this.state.colors[7]
            }
            else if (row["spots"] > 10000) {
                color = this.state.colors[8]
            } 

            // var red = (row["spots"] / (this.state.dataControllerState.historicalData.maxSpotsByState / 5)) * 255;
            // var color = "rgba(" + red + ", " + 20 + ", " + 50 + ", 1)";
            expression.push(row["STATE_ID"], color);
        }.bind(this));

        // last value is the default, used where there is no data
        expression.push("rgba(0,0,0,0)");

        // add layer from the vector tile source with data-driven style
        this.state.map.addLayer({
            "id": "states-join",
            "type": "fill",
            "source": "states",
            "source-layer": "states",
            "paint": {
                "fill-color": expression
            }
        }, 'waterway-label');
    }

    // tutorial() {
    //     // Join local JSON data with vector tile geometry
    //     // USA unemployment rate in 2009
    //     // Source https://data.bls.gov/timeseries/LNS14000000
    //     var maxValue = 13;
    //     var data = [
    //         {"STATE_ID": "01", "unemployment": 13.17},
    //         {"STATE_ID": "02", "unemployment": 9.5},
    //         {"STATE_ID": "04", "unemployment": 12.15},
    //         {"STATE_ID": "05", "unemployment": 8.99},
    //         {"STATE_ID": "06", "unemployment": 11.83},
    //         {"STATE_ID": "08", "unemployment": 7.52},
    //         {"STATE_ID": "09", "unemployment": 6.44},
    //         {"STATE_ID": "10", "unemployment": 5.17},
    //         {"STATE_ID": "12", "unemployment": 9.67},
    //         {"STATE_ID": "13", "unemployment": 10.64},
    //         {"STATE_ID": "15", "unemployment": 12.38},
    //         {"STATE_ID": "16", "unemployment": 10.13},
    //         {"STATE_ID": "17", "unemployment": 9.58},
    //         {"STATE_ID": "18", "unemployment": 10.63},
    //         {"STATE_ID": "19", "unemployment": 8.09},
    //         {"STATE_ID": "20", "unemployment": 5.93},
    //         {"STATE_ID": "21", "unemployment": 9.86},
    //         {"STATE_ID": "22", "unemployment": 9.81},
    //         {"STATE_ID": "23", "unemployment": 7.82},
    //         {"STATE_ID": "24", "unemployment": 8.35},
    //         {"STATE_ID": "25", "unemployment": 9.1},
    //         {"STATE_ID": "26", "unemployment": 10.69},
    //         {"STATE_ID": "27", "unemployment": 11.53},
    //         {"STATE_ID": "28", "unemployment": 9.29},
    //         {"STATE_ID": "29", "unemployment": 9.94},
    //         {"STATE_ID": "30", "unemployment": 9.29},
    //         {"STATE_ID": "31", "unemployment": 5.45},
    //         {"STATE_ID": "32", "unemployment": 4.21},
    //         {"STATE_ID": "33", "unemployment": 4.27},
    //         {"STATE_ID": "34", "unemployment": 4.09},
    //         {"STATE_ID": "35", "unemployment": 7.83},
    //         {"STATE_ID": "36", "unemployment": 8.01},
    //         {"STATE_ID": "37", "unemployment": 9.34},
    //         {"STATE_ID": "38", "unemployment": 11.23},
    //         {"STATE_ID": "39", "unemployment": 7.08},
    //         {"STATE_ID": "40", "unemployment": 11.22},
    //         {"STATE_ID": "41", "unemployment": 6.2},
    //         {"STATE_ID": "42", "unemployment": 9.11},
    //         {"STATE_ID": "44", "unemployment": 10.42},
    //         {"STATE_ID": "45", "unemployment": 8.89},
    //         {"STATE_ID": "46", "unemployment": 11.03},
    //         {"STATE_ID": "47", "unemployment": 7.35},
    //         {"STATE_ID": "48", "unemployment": 8.92},
    //         {"STATE_ID": "49", "unemployment": 7.65},
    //         {"STATE_ID": "50", "unemployment": 8.01},
    //         {"STATE_ID": "51", "unemployment": 7.62},
    //         {"STATE_ID": "53", "unemployment": 7.77},
    //         {"STATE_ID": "54", "unemployment": 8.49},
    //         {"STATE_ID": "55", "unemployment": 9.42},
    //         {"STATE_ID": "56", "unemployment": 7.59}
    //     ];
    //
    //     this.state.map.on('load', function() {
    //         // Add source for state polygons hosted on Mapbox, based on US Census Data:
    //         // https://www.census.gov/geo/maps-data/data/cbf/cbf_state.html
    //         this.state.map.addSource("states", {
    //             type: "vector",
    //             url: "mapbox://mapbox.us_census_states_2015"
    //         });
    //
    //         console.log(this.state.map)
    //
    //         var expression = ["match", ["get", "STATE_ID"]];
    //
    //         // Calculate color for each state based on the unemployment rate
    //         data.forEach(function(row) {
    //             var green = (row["unemployment"] / maxValue) * 255;
    //             var color = "rgba(" + 0 + ", " + green + ", " + 0 + ", 1)";
    //             expression.push(row["STATE_ID"], color);
    //         });
    //
    //         // Last value is the default, used where there is no data
    //         expression.push("rgba(0,0,0,0)");
    //
    //         // Add layer from the vector tile source with data-driven style
    //         this.state.map.addLayer({
    //             "id": "states-join",
    //             "type": "fill",
    //             "source": "states",
    //             "source-layer": "states",
    //             "paint": {
    //                 "fill-color": expression
    //             }
    //         }, 'waterway-label');
    //
    //     }.bind(this));
    // }
}

export default PredictiveMap
