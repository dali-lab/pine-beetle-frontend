import React, { Component } from 'react';
import LoadingContainer from '../LoadingContainer';
import PredictionsSelectionBar from '../selection-bar/PredictionsSelectionBar';
import '../../styles/predictions/ViewPredictions.css';

class ViewPredictions extends Component {
    constructor(props) {
        super(props);

        // create initial state
        this.state = {
            dataController: null,       // holds references to functions that are used to update the state, forest, etc.
            dataControllerState: null  // defines the user's current selection for state, national forest, etc.
        }

    }

    render() {
        if (this.state.dataController != null && this.state.dataControllerState != null) {
            return(
                <div>
                    <PredictionsSelectionBar
                        predictiveModelDate={this.state.dataControllerState.predictiveModelDate}
                        stateName={this.state.dataControllerState.stateName}
                        nationalForest={this.state.dataControllerState.nationalForest}
                        forest={this.state.dataControllerState.forest}
                        availableStates={this.state.dataControllerState.availableStates}
                        availableNationalForests={this.state.dataControllerState.availableNationalForests}
                        availableLocalForests={this.state.dataControllerState.availableLocalForests}
                        availableYears={this.state.dataControllerState.availableYears}

                        updatePredictionYearSelection={this.state.dataController.updatePredictionYearSelection}
                        updateStateSelection={this.state.dataController.updateStateSelection}
                        updateNationalForestSelection={this.state.dataController.updateNationalForestSelection}
                        updateForestSelection={this.state.dataController.updateForestSelection}
                        clearCurrentData={this.state.dataController.clearCurrentData}
                    />
                    <div className="container">
                        <p>Check back soon for more functionality!</p>
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

        // select most recent year
        if (this.props.dataControllerState !== undefined && this.props.dataControllerState != null && this.props.dataController !== undefined && this.props.dataController != null) {
            this.props.dataController.current.updatePredictionYearSelection(this.props.dataControllerState.availableYears[this.props.dataControllerState.availableYears.length - 1]);
        }
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
