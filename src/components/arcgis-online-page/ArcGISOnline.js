import React, { Component } from 'react';
import { WebMap } from 'react-arcgis';

class ArcGISOnline extends Component {
    render() {
        return(
            <div className="container">
                <div id="viewDiv">
                    <WebMap id="ee85e7fa197b4c6082489ee605cf73a9" />
                </div>
            </div>
        );
    }
}

export default ArcGISOnline
