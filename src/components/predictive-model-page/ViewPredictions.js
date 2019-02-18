import React, { Component } from 'react';
import LoadingContainer from '../LoadingContainer';
import PredictionsSelectionBar from '../selection-bars/PredictionsSelectionBar';
import ViewModelOutput from './ViewModelOutput.js';
import PredictiveMapState from './mapbox/PredictiveMapState.js';
import '../../styles/predictive-model-page/ViewPredictions.css';

class ViewPredictions extends Component {
    constructor(props) {
        super(props);

        // create initial state
        this.state = {
            dataController: null,       // holds references to functions that are used to update the state, forest, etc.
            dataControllerState: null   // defines the user's current selection for state, national forest, etc.
        }
    }

    render() {
        if (this.state.dataController != null && this.state.dataControllerState != null && this.state.dataControllerState.dropDownContent.availableYears.length > 0) {
            if (!this.state.dataControllerState.userFilters.latestModelYear) {
                return(
                    <div>
                        <PredictionsSelectionBar dataController={this.state.dataController} dataControllerState={this.state.dataControllerState} />
                        <ViewModelOutput dataController={this.state.dataController} dataControllerState={this.state.dataControllerState} />
                        <PredictiveMapState dataController={this.state.dataController} dataControllerState={this.state.dataControllerState} />
                    </div>
                );
            }
            else {
                return(
                    <div>
                        <PredictionsSelectionBar dataController={this.state.dataController} dataControllerState={this.state.dataControllerState} />
                        <ViewModelOutput dataController={this.state.dataController} dataControllerState={this.state.dataControllerState} />
                    </div>
                );
            }
        }
        else {
            return <LoadingContainer />
        }
    }

    componentDidMount() {
        this.updateStateFromProps(this.props);

        // select most recent year
        // if (this.props.dataControllerState !== undefined && this.props.dataControllerState != null && this.props.dataController !== undefined && this.props.dataController != null) {
        //     this.props.dataController.current.updatePredictionYearSelection(this.props.dataControllerState.dropDownContent.availableYears[this.props.dataControllerState.dropDownContent.availableYears.length - 1]);
        // }
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
}

export default ViewPredictions
