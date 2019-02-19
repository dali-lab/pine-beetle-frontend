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

                            // handle new year selection here
      
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

                    // select state when user clicks on it
                    this.state.map.on('click', 'states-join', function (e) {
                        this.state.dataController.updateStateSelection(e.features[0].properties.STATE_ID)
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

        // handle new year selection here\
        if (this.state.dataControllerState.userFilters.predictiveModelDate === this.state.dataControllerState.userFilters.originalEndDate + 1) {
            console.log("made it")
        }
        else {
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
    }
}

export default PredictiveMap
