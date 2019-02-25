import React, { Component } from 'react';
import '../../../styles/predictive-model-page/PredictiveMap.css';
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
require('dotenv').config() // load mapbox access token

class StateMap extends Component {
    constructor(props) {
        super(props)
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

        this.state = {
            map: null,
            dataController: null,
            dataControllerState: null
        }

        this.createMap = this.createMap.bind(this);
    }
    render() {
        return(
            <div className="map-container">
                <div id="map"></div>
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

                    this.state.map.on('load', function() {
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

                    }.bind(this));

                    // select state when user clicks on it
                    this.state.map.on('click', 'states-join', function (e) {
                        this.state.dataController.updateStateSelection(e.features[0].properties.STATE_ID)
                    }.bind(this));
                }
            });
        }
    }
}

export default StateMap
