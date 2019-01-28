import React, { Component } from 'react';
import ReactMapGL, {NavigationControl, Marker, Popup, Layer, Feature} from 'react-map-gl';
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
            summarizedDataByLatLong: []
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

                { this.state.summarizedDataByLatLong.map(this.renderMarker) }
                {this.renderPopup()}

            </ReactMapGL>
        );
    }

    componentWillMount() {
        this.updateStateFromProps(this.props)
    }

    componentDidMount() {
        this.updateStateFromProps(this.props);
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

        // sort based on spots
        newArray.sort((a,b) => (a.spots > b.spots) ? 1 : ((b.spots > a.spots) ? -1 : 0));

        // determine low, medium, and high
        var low = newArray.slice(0, Math.ceil(newArray.length / 4));
        var medium = newArray.slice(Math.ceil(newArray.length / 4), 3 * Math.ceil(newArray.length / 4));
        var high = newArray.slice(3 * Math.ceil(newArray.length / 4));

        // clear out new array
        newArray = [];

        for (entry in low) {
            low[entry].spotsClassification = "low";
            newArray.push(low[entry])
        }

        for (entry in medium) {
            medium[entry].spotsClassification = "medium";
            newArray.push(medium[entry])
        }

        for (entry in high) {
            high[entry].spotsClassification = "high";
            newArray.push(high[entry])
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
                <Pin size={20} onClick={() => this.setState({popupInfo: object})} object={object} numObjects={this.state.summarizedDataByLatLong.length}/>
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

    // add resize event listener
    componentDidMount() {
        window.addEventListener("resize", this.updateMapDimensions.bind(this));
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
