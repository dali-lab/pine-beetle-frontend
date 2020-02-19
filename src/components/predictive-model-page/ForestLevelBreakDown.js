import React, { Component } from 'react';
import ModelInputArea from './ModelInputArea.js';
import ProbabilityDistribution from './ProbabilityDistribution.js';
import PredictionVsOutcome from './PredictionVsOutcome.js';

class ForestLevelBreakDown extends Component {
    constructor(props) {
        super(props);

        // create initial state
        this.state = {
            dataController: null,       // holds references to functions that are used to update the state, forest, etc.
            dataControllerState: null,   // defines the user's current selection for state, national forest, etc.
            editMode: false,
            confusionMatrixVisible: true,
        }

        this.setEditMode = this.setEditMode.bind(this);
    }

    switchTab(id) {
        let visiblity = false;

        if(id === 1) {
            visiblity = true;
        }

        console.log("Forest Switching Tab: ")
        console.log(visiblity);
        console.log(id);

        this.setState({
            confusionMatrixVisible: visiblity,
        });
    }

    render() {
        if (this.state.dataController !== null && this.state.dataControllerState !== null) {
            if (this.state.dataControllerState.runningModel) {
                return null;
            }
            else if (this.state.dataControllerState.userFilters.forest !== null) {
                return(
                    <div>
                        <div className="container" id="now-viewing-model-container">
                            <p>Currently viewing data for: <span><b>{this.props.dataControllerState.userFilters.forest}</b></span>. Select a new locality to view a different forest's data.</p>
                        </div>
                        <ModelInputArea dataControllerState={this.state.dataControllerState} dataController={this.state.dataController} editMode={this.state.editMode} setEditMode={this.setEditMode} switchTab={this.switchTab} color={this.state.editMode === true ? "#CCE1B6" : "#f4f4f4"}/>
                        <ProbabilityDistribution confusionMatrixVisible={this.state.confusionMatrixVisible} dataControllerState={this.state.dataControllerState} dataController={this.state.dataController} data={this.state.outputs} />
                    </div>
                );
            }
            else {
                return null;
            }
        }
        else {
            return null;
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
                dataController: props.dataController
            });
        }

        if (props.dataControllerState !== undefined && props.dataControllerState != null) {
            this.setState({
                dataControllerState: props.dataControllerState,
                inputs: props.dataControllerState.predictiveModelInputs,
                outputs: props.dataControllerState.predictiveModelOutputs
            });
        }
    }

    setEditMode(value) {
        this.setState({
            editMode: value
        });
    }
}

export default ForestLevelBreakDown
