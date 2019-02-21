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
                spotst2: 0
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

        this.updateSPB = this.updateSPB.bind(this);
    }

    render() {
        if (this.state.dataController !== null && this.state.dataControllerState !== null) {
            if (this.state.dataControllerState.userFilters.nationalForest !== null || this.state.dataControllerState.userFilters.forest !== null) {
                return(
                    <div>
                        <div className="flex-container">
                            <div className="container" id="filter-selections">
                                <div id="selection-areas-view-data">
                                    <TextInput instructions="SPB" submitFunction={this.updateSPB} valueToDisplay={this.state.inputs.SPB !== null ? this.state.inputs.SPB : "null"}/>
                                    <TextInput instructions="cleridst1" submitFunction={this.props.dataController.updateCleridst1Selection} valueToDisplay={this.state.inputs.cleridst1 !== null ? this.state.inputs.cleridst1 : "null"}/>
                                    <TextInput instructions="spotst1" submitFunction={this.props.dataController.updateSpotst1Selection} valueToDisplay={this.state.inputs.spotst1 !== null ? this.state.inputs.spotst1 : "null"}/>
                                    <TextInput instructions="spotst2" submitFunction={this.props.dataController.updateSpotst2Selection} valueToDisplay={this.state.inputs.spotst2 !== null ? this.state.inputs.spotst2 : "null"}/>
    
                                    <button id="reset-current-data-button" className="submit static-button" onClick={this.props.dataController.runModel}>Reset Values</button>
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

    updateSPB(value) {
        var inputs = Object.assign({}, this.state.inputs);
        inputs.SPB = parseInt(value);

        this.setState({
            inputs: inputs
        }, () => {
            this.props.dataController.updateSPBSelection(value);
        });
    }
}

export default ForestLevelBreakDown
