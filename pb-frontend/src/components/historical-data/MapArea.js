import React, { Component } from 'react';
import { Map } from 'react-arcgis';
import '../../styles/historical-data/MapArea.css';

class MapArea extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Map />
        );
    }
}

export default MapArea
