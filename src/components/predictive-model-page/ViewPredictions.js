import React, { Component } from 'react';
import LoadingContainer from '../LoadingContainer';
import PredictionsSelectionBar from '../selection-bars/PredictionsSelectionBar';
import ViewModelOutput from './ViewModelOutput.js';
import PredictiveMap from './mapbox/PredictiveMap.js';
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
        if (this.state.dataController != null && this.state.dataControllerState != null) {
            return(
                <div>
                    <PredictionsSelectionBar dataController={this.state.dataController} dataControllerState={this.state.dataControllerState} />
                    <ViewModelOutput modelOutputs={this.state.dataControllerState.predictiveModelOutputs} modelInputs={this.state.dataControllerState.predictiveModelInputs} />
                    <PredictiveMap dataController={this.state.dataController} dataControllerState={this.state.dataControllerState} predictiveMapBuilt={this.state.predictiveMapBuilt} updatePredictiveMapBuilt={this.updatePredictiveMapBuilt}/>
                </div>
            );
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
