import React, { Component } from 'react';
import ReactMapGL, {NavigationControl, Marker, Popup} from 'react-map-gl';
import Pin from './Pin';
import PopupContent from './PopupContent';
import '../../../styles/historical-data-page/mapbox/MapBoxMap.css';
require('dotenv').config() // load mapbox access token

class MapBoxMap extends Component {
    constructor(props) {
        super(props)

        this.state = {
            viewport: {
                width: ((window.innerWidth - 62) * 0.70),
                height: 600,
                latitude: 33.7490,
                longitude: -84.3880,
                zoom: 4.8,
                bearing: 0,
                pitch: 0
            },
            navStyle: {
                position: 'absolute',
                top: 0,
                left: 0,
                padding: '10px'
            },
            popupInfo: null,
            summarizedDataByLatLong: [],
            thresholds: ['0-100', '100-250', '250-500', '500-750', '750-1,000', '1,000-2,000', '2,000-5,000', '5,000-10,000', '10,000+'],
            colors: ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026', '#4F0017'],
            legendTags: []
        }

        this.updateViewport = this.updateViewport.bind(this);
        this.renderMarker = this.renderMarker.bind(this);
        this.renderPopup = this.renderPopup.bind(this);
    }
    render() {
        return (
            <ReactMapGL {...this.state.viewport} onViewportChange={this.updateViewport} mapStyle="mapbox://styles/mapbox/streets-v9" mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN} scrollZoom={false} onClick={this.handleMouseClick}>
                <div className="nav" style={this.state.navStyle}>
                    <NavigationControl onViewportChange={this.updateViewport} captureScroll={false} showCompass={false} />
                </div>

                <div className='map-overlay-legend' id='legend'>
                    {this.state.legendTags}
                </div>

                { this.state.summarizedDataByLatLong.map(this.renderMarker) }
                {this.renderPopup()}

            </ReactMapGL>
        );
    }

    componentWillMount() {
        this.updateStateFromProps(this.props)
        var legendTags = []

        // add legend tags
        for (var i = 0; i < this.state.colors.length; i++) {
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
    }

    componentDidMount() {
        this.updateStateFromProps(this.props);
        window.addEventListener("resize", this.updateMapDimensions.bind(this));     // add resize event listener
    }

    // if receiving new data, update the state
    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    updateStateFromProps(props) {
        // clone the summarizedDataByLatLong array
        var newArray = []
        for (var entry in props.summarizedDataByLatLong) {
            var dataObject = JSON.parse(JSON.stringify(props.summarizedDataByLatLong[entry]))
            newArray.push(dataObject);
        }

        this.setState({
            summarizedDataByLatLong: newArray
        });
    }

    updateViewport(viewport) {
        this.setState({
            viewport: viewport
        });
    }

    renderMarker(object, index) {
        // change selection based on what user clicked on here
        return(
            <Marker
                key={'marker-' + index}
                longitude={object.longitude}
                latitude={object.latitude} >
                <Pin size={20} onClick={() => this.setState({popupInfo: object})} object={object} numObjects={this.state.summarizedDataByLatLong.length} colors={this.state.colors} />
            </Marker>
        );
    }

    renderPopup() {
        const popupInfo = this.state.popupInfo

        return popupInfo && (
            <Popup tipSize={4}
                anchor="top"
                longitude={popupInfo.longitude}
                latitude={popupInfo.latitude}
                closeOnClick={false}
                onClose={() => this.setState({popupInfo: null})} >
                <PopupContent info={popupInfo} />
            </Popup>
        )
    }

    handleMouseClick(event) {
        console.log("MOUSE WAS CLICKED")
        console.log(event)
    }

    // remove event listener
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateMapDimensions.bind(this));
    }

    updateMapDimensions(event) {
        this.setState({
            viewport: {
                width: ((window.innerWidth - 62) * 0.70),
                height: this.state.viewport.height,
                latitude: this.state.viewport.latitude,
                longitude: this.state.viewport.longitude,
                zoom: this.state.viewport.zoom,
                bearing: this.state.viewport.bearing,
                pitch: this.state.viewport.pitch
            }
        });
    }
}

export default MapBoxMap
