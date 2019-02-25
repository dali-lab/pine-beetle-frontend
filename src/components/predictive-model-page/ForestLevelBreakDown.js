import React, { Component } from 'react';
import TextInput from '../selection-bars/input-components/TextInput';
import ProbabilityDistribution from './ProbabilityDistribution.js';

class ForestLevelBreakDown extends Component {
    constructor(props) {
        super(props);

        // create initial state
        this.state = {
            dataController: null,       // holds references to functions that are used to update the state, forest, etc.
            dataControllerState: null,   // defines the user's current selection for state, national forest, etc.
            inputs: {
                SPB: 0,
                cleridst1: 0,
                spotst1: 0,
                spotst2: 0,
                endobrev: 1
            },
            outputs: {
                expSpotsIfOutbreak: 0,
                prob0spots: 0,
                prob19spots: 0,
                prob53spots: 0,
                prob147spots: 0,
                prob402spots: 0,
                prob1095spots: 0
            }
        }

        this.updateSPBSelection = this.updateSPBSelection.bind(this);
        this.updateCleridst1Selection = this.updateCleridst1Selection.bind(this);
        this.updateSpotst1Selection = this.updateSpotst1Selection.bind(this);
        this.updateSpotst2Selection = this.updateSpotst2Selection.bind(this);
        this.updateEndobrevSelection = this.updateEndobrevSelection.bind(this);
    }

    render() {
        if (this.state.dataController !== null && this.state.dataControllerState !== null) {
            if (this.state.dataControllerState.runningModel) {
                return null;
            }
            else if (this.state.dataControllerState.userFilters.forest !== null) {
                return(
                    <div>
                        <div className="flex-container">
                            <div className="container dropdown-bar" id="pred-model-filters">
                                <div id="selection-areas-view-data">
                                    <TextInput instructions="SPB" submitFunction={this.updateSPBSelection} valueToDisplay={this.state.inputs.SPB !== null ? this.state.inputs.SPB : "null"}/>
                                    <TextInput instructions="cleridst1" submitFunction={this.updateCleridst1Selection} valueToDisplay={this.state.inputs.cleridst1 !== null ? this.state.inputs.cleridst1 : "null"}/>
                                    <TextInput instructions="spotst1" submitFunction={this.updateSpotst1Selection} valueToDisplay={this.state.inputs.spotst1 !== null ? this.state.inputs.spotst1 : "null"}/>
                                    <TextInput instructions="spotst2" submitFunction={this.updateSpotst2Selection} valueToDisplay={this.state.inputs.spotst2 !== null ? this.state.inputs.spotst2 : "null"}/>
                                    <TextInput instructions="endobrev" submitFunction={this.updateEndobrevSelection} valueToDisplay={this.state.inputs.endobrev !== null ? this.state.inputs.endobrev : "null"}/>

                                    <button id="reset-current-data-button" className="submit static-button" onClick={this.props.dataController.resetModelSelections}>Reset Values</button>
                                </div>
                            </div>
                        </div>
                        <ProbabilityDistribution dataControllerState={this.state.dataControllerState} data={this.state.outputs} />
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

    updateSPBSelection(value) {
        if (!isNaN(value)) {
            this.props.dataController.updateSPBSelection(value);
        }
        else {
            var inputs = Object.assign({}, this.state.inputs);
            inputs.SPB = this.state.inputs.SPB;

            this.setState({
                inputs: inputs
            });
        }
    }

    updateCleridst1Selection(value) {
        if (!isNaN(value)) {
            this.props.dataController.updateCleridst1Selection(value);
        }
        else {
            var inputs = Object.assign({}, this.state.inputs);
            inputs.cleridst1 = this.state.inputs.cleridst1;

            this.setState({
                inputs: inputs
            });
        }
    }

    updateSpotst1Selection(value) {
        if (!isNaN(value)) {
            this.props.dataController.updateSpotst1Selection(value);
        }
        else {
            var inputs = Object.assign({}, this.state.inputs);
            inputs.spotst1 = this.state.inputs.spotst1;

            this.setState({
                inputs: inputs
            });
        }
    }

    updateSpotst2Selection(value) {
        if (!isNaN(value)) {
            this.props.dataController.updateSpotst2Selection(value);
        }
        else {
            var inputs = Object.assign({}, this.state.inputs);
            inputs.spotst2 = this.state.inputs.spotst2;

            this.setState({
                inputs: inputs
            });
        }
    }

    updateEndobrevSelection(value) {
        if (parseInt(value) === 0 || parseInt(value) === 1) {
            this.props.dataController.updateEndobrevSelection(value);
        }
        else {
            var inputs = Object.assign({}, this.state.inputs);
            inputs.endobrev = this.state.inputs.endobrev;

            this.setState({
                inputs: inputs
            });
        }
    }
}

export default ForestLevelBreakDown
