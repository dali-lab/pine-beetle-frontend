import React, { Component } from 'react';
import LoadingContainer from '../LoadingContainer';
import HistoricalDataSelectionBar from '../selection-bars/HistoricalDataSelectionBar';
import LineChartArea from './LineChartArea';
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
        }

        // bind functions and create references
        this.movePredictionModelDown = this.movePredictionModelDown.bind(this);
        this.containerComponent = React.createRef();
    }
    render() {
        if (this.state.dataController != null && this.state.dataControllerState != null && this.state.dataControllerState.historicalData.summarizedDataByYear !== null && this.state.dataControllerState.historicalData.summarizedDataByLatLong !== null) {
            return(
                <div ref={this.containerComponent}>
                    <HistoricalDataSelectionBar dataController={this.state.dataController} dataControllerState={this.state.dataControllerState} movePredictionModelDown={this.movePredictionModelDown}/>
    				        <LineChartArea data={this.state.dataControllerState.historicalData.summarizedDataByYear} firstObservedYear={this.state.dataControllerState.userFilters.startDate} lastObservedYear={this.state.dataControllerState.userFilters.endDate} />
              
                    <div className="flex-container" id="map-area-container">
                        <div className="flex-item flex-item-left" id="mapbox-container">
                            <MapBoxMap summarizedDataByLatLong={this.state.dataControllerState.historicalData.summarizedDataByLatLong} />
                        </div>
                        <div className="flex-item flex-item-right container" id="beetle-count-area">
                            <MapSideBar data={this.state.dataControllerState.historicalData.summarizedDataByLatLong} stateName={this.state.dataControllerState.userFilters.stateName} nationalForest={this.state.dataControllerState.userFilters.nationalForest} forest={this.state.dataControllerState.userFilters.forest} clearFunction={this.state.dataController.clearCurrentData}/>
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
