import React, { Component } from 'react';
import LoadingContainer from '../LoadingContainer';
import SelectionBar from '../selection-bar/SelectionBar';
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
                    <div className="flex-container">
                        <div className="container" id="filter-selections">
                            <div id="selection-areas-view-data">
                                <SelectionBar
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
                                />
                            </div>
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
}

export default ViewPredictions
