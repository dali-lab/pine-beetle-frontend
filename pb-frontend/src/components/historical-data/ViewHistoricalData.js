import React, { Component } from 'react';
import LoadingContainer from '../LoadingContainer';
import HistoricalDataSelectionBar from '../selection-bar/HistoricalDataSelectionBar';
import LineChartArea from './LineChartArea';
import BarChartArea from './BarChartArea';
import { Map } from 'react-arcgis';
import ArcGISMapController from './ArcGISMapController';
import MapBoxMap from './mapbox/MapBoxMap';
import MapSideBar from './MapSideBar';
import '../../styles/historical-data/ViewHistoricalData.css';
import '../../styles/historical-data/LoadingContainer.css';

class ViewHistoricalData extends Component {
    constructor(props) {
        super(props);

        // create initial state
        this.state = {
            dataController: null,       // holds references to functions that are used to update the state, forest, etc.
            dataControllerState: null,  // defines the user's current selection for state, national forest, etc.
            viewProperties: {
                center: [-84.3880, 33.7490],
                zoom: 5.5
            }
        }

        // bind functions
        this.movePredictionModelDown = this.movePredictionModelDown.bind(this);

        // create references
        this.containerComponent = React.createRef();
    }
    render() {
        if (this.state.dataController != null && this.state.dataControllerState != null) {
            return(
                <div ref={this.containerComponent}>
                    <HistoricalDataSelectionBar
                        startDate={this.state.dataControllerState.startDate}
                        endDate={this.state.dataControllerState.endDate}
                        stateName={this.state.dataControllerState.stateName}
                        nationalForest={this.state.dataControllerState.nationalForest}
                        forest={this.state.dataControllerState.forest}
                        availableStates={this.state.dataControllerState.availableStates}
                        availableNationalForests={this.state.dataControllerState.availableNationalForests}
                        availableLocalForests={this.state.dataControllerState.availableLocalForests}

                        updateStartDate={this.state.dataController.updateStartDate}
                        updateEndDate={this.state.dataController.updateEndDate}
                        updateStateSelection={this.state.dataController.updateStateSelection}
                        updateNationalForestSelection={this.state.dataController.updateNationalForestSelection}
                        updateForestSelection={this.state.dataController.updateForestSelection}
                        clearCurrentData={this.state.dataController.clearCurrentData}
                        movePredictionModelDown={this.movePredictionModelDown}
                    />

    				<LineChartArea data={this.state.dataControllerState.summarizedDataByYear} firstObservedYear={this.state.dataControllerState.startDate} lastObservedYear={this.state.dataControllerState.endDate} />
                    <BarChartArea data={this.state.dataControllerState.summarizedDataByYear} firstObservedYear={this.state.dataControllerState.startDate} lastObservedYear={this.state.dataControllerState.endDate} />

                    <div className="flex-container" id="map-area-container">
                        <div className="flex-item flex-item-left" id="mapbox-container">
                            <MapBoxMap summarizedDataByLatLong={this.state.dataControllerState.summarizedDataByLatLong} />
                        </div>
                        <div className="flex-item flex-item-right container" id="beetle-count-area">
                            <MapSideBar data={this.state.dataControllerState.summarizedDataByLatLong} stateName={this.state.dataControllerState.stateName} nationalForest={this.state.dataControllerState.nationalForest} forest={this.state.dataControllerState.forest} clearFunction={this.state.dataController.clearCurrentData}/>
                        </div>
        			</div>
        		</div>
            );
        }

        else {
            return <LoadingContainer />
        }

    }

    componentDidMount() {
        this.updateStateFromProps(this.props);
    }

    // if receiving new data, update the state
    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    updateStateFromProps(props) {
        if (props.dataController !== undefined && props.dataController != null) {
            this.setState({
                dataController: props.dataController.current
            });
        }

        if (props.dataControllerState !== undefined && props.dataControllerState != null) {
            this.setState({
                dataControllerState: props.dataControllerState
            });
        }
    }

    // move the prediction model down
    movePredictionModelDown() {
        // grab references
        var area1 = this.containerComponent.current.children[1];
        var area2 = this.containerComponent.current.children[2];

        // remove
        this.containerComponent.current.removeChild(area1);
        this.containerComponent.current.removeChild(area2);

        // add
        this.containerComponent.current.appendChild(area2);
        this.containerComponent.current.appendChild(area1);
    }
}

export default ViewHistoricalData
