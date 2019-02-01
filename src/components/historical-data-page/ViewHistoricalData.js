import React, { Component } from 'react';
import LoadingContainer from '../LoadingContainer';
import HistoricalDataSelectionBar from '../selection-bars/HistoricalDataSelectionBar';
import LineChartArea from './LineChartArea';
import BarChartArea from './BarChartArea';
import { Map } from 'react-arcgis';
import MapBoxMap from './mapbox/MapBoxMap';
import MapSideBar from './MapSideBar';
import '../../styles/historical-data-page/ViewHistoricalData.css';

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
        if (this.state.dataController != null && this.state.dataControllerState != null && this.state.dataControllerState.summarizedDataByYear !== null && this.state.dataControllerState.summarizedDataByLatLong !== null) {
            return(
                <div ref={this.containerComponent}>
                    <HistoricalDataSelectionBar dataController={this.state.dataController} dataControllerState={this.state.dataControllerState} movePredictionModelDown={this.movePredictionModelDown}/>

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
