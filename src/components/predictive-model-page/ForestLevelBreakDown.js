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

        this.getCustomModelOutputs = this.getCustomModelOutputs.bind(this);
        this.updateSPBSelection = this.updateSPBSelection.bind(this);
        this.updateCleridst1Selection = this.updateCleridst1Selection.bind(this);
        this.updateSpotst1Selection = this.updateSpotst1Selection.bind(this);
        this.updateSpotst2Selection = this.updateSpotst2Selection.bind(this);
        this.updateEndobrevSelection = this.updateEndobrevSelection.bind(this);

        this.SPBInput = React.createRef();
        this.cleridst1Input = React.createRef();
        this.spotst1Input = React.createRef();
        this.spotst2Input = React.createRef();
        this.endobrevInput = React.createRef();
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
                                    <TextInput instructions="SPB" submitFunction={this.updateSPBSelection} valueToDisplay={this.state.inputs.SPB !== null ? this.state.inputs.SPB : "null"} ref={this.SPBInput} />
                                    <TextInput instructions="cleridst1" submitFunction={this.updateCleridst1Selection} valueToDisplay={this.state.inputs.cleridst1 !== null ? this.state.inputs.cleridst1 : "null"} ref={this.cleridst1Input} />
                                    <TextInput instructions="spotst1" submitFunction={this.updateSpotst1Selection} valueToDisplay={this.state.inputs.spotst1 !== null ? this.state.inputs.spotst1 : "null"} ref={this.spotst1Input} />
                                    <TextInput instructions="spotst2" submitFunction={this.updateSpotst2Selection} valueToDisplay={this.state.inputs.spotst2 !== null ? this.state.inputs.spotst2 : "null"} ref={this.spotst2Input} />
                                    <TextInput instructions="endobrev" submitFunction={this.updateEndobrevSelection} valueToDisplay={this.state.inputs.endobrev !== null ? this.state.inputs.endobrev : "null"} ref={this.endobrevInput} />

                                    <button id="reset-current-data-button" className="submit static-button" onClick={this.getCustomModelOutputs}>Run Model</button>
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

    getCustomModelOutputs() {
        var inputs = {
            SPB: this.SPBInput.current.state.value,
            cleridst1: this.cleridst1Input.current.state.value,
            spotst1: this.spotst1Input.current.state.value,
            spotst2: this.spotst2Input.current.state.value,
            endobrev: this.endobrevInput.current.state.value
        }

        this.props.dataController.getCustomModelOutputs(inputs)
    }

    updateSPBSelection(value) {
        if (!isNaN(value)) {
            this.getCustomModelOutputs();
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
            this.getCustomModelOutputs();
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
            this.getCustomModelOutputs();
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
            this.getCustomModelOutputs();
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
            this.getCustomModelOutputs();
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
