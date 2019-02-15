import React, { Component } from 'react';
import TextInput from '../selection-bars/input-components/TextInput';
import '../../styles/predictive-model-page/ViewModelOutput.css';

class ViewModelOutput extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
    }
    render() {
        if (this.props.dataControllerState.userFilters.stateAbbreviation !== null) {
            return(
                <div>
                    <div className="flex-container">
                        <div className="container" id="filter-selections">
                            <div id="selection-areas-view-data">
                                <TextInput instructions="SPB" submitFunction={this.props.dataController.updateSPBSelection} valueToDisplay={this.state.inputs.SPB !== null ? this.state.inputs.SPB : "null"}/>
                                <TextInput instructions="cleridst1" submitFunction={this.props.dataController.updateCleridst1Selection} valueToDisplay={this.state.inputs.cleridst1 !== null ? this.state.inputs.cleridst1 : "null"}/>
                                <TextInput instructions="spotst1" submitFunction={this.props.dataController.updateSpotst1Selection} valueToDisplay={this.state.inputs.spotst1 !== null ? this.state.inputs.spotst1 : "null"}/>
                                <TextInput instructions="spotst2" submitFunction={this.props.dataController.updateSpotst2Selection} valueToDisplay={this.state.inputs.spotst2 !== null ? this.state.inputs.spotst2 : "null"}/>

                                <button id="reset-current-data-button" className="submit static-button" onClick={this.props.dataController.getCustomModelOutputs}>Run Model</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-container">
                        <div className="container" id="filter-selections">
                            <div id="selection-areas-view-data">
                                <h3>Expected Spots If Outbreak: <span className="no-bold">{this.state.outputs.expSpotsIfOutbreak !== null ? this.state.outputs.expSpotsIfOutbreak.toFixed(3) : "null"}</span></h3>
                                <h3>Probability &gt; 0 Spots: <span className="no-bold">{this.state.outputs.prob0spots !== null ? this.state.outputs.prob0spots.toFixed(3) : "null"}</span></h3>
                                <h3>Probability &gt; 19 Spots: <span className="no-bold">{this.state.outputs.prob19spots !== null ? this.state.outputs.prob19spots.toFixed(3) : "null"}</span></h3>
                                <h3>Probability &gt; 53 Spots: <span className="no-bold">{this.state.outputs.prob53spots !== null ? this.state.outputs.prob53spots.toFixed(3) : "null"}</span></h3>
                                <h3>Probability &gt; 147 Spots: <span className="no-bold">{this.state.outputs.prob147spots !== null ? this.state.outputs.prob147spots.toFixed(3) : "null"}</span></h3>
                                <h3>Probability &gt; 402 Spots: <span className="no-bold">{this.state.outputs.prob402spots !== null ? this.state.outputs.prob402spots.toFixed(3) : "null"}</span></h3>
                                <h3>Probability &gt; 1095 Spots: <span className="no-bold">{this.state.outputs.prob1095spots !== null ? this.state.outputs.prob1095spots.toFixed(3) : "null"}</span></h3>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return(
                <div className="container">
                    <h3>Please select a state to run the predictive model.</h3>
                </div>
            );
        }
    }

    // on mount, update the state
    componentDidMount() {
        this.updateStateFromProps(this.props);
    }

    // if we are receiving new data, update the state before rendering
    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    // recalculate values to show on page
    updateStateFromProps(props) {
        this.setState({
            inputs: {
                SPB: props.dataControllerState.predictiveModelInputs.SPB,
                cleridst1: props.dataControllerState.predictiveModelInputs.cleridst1,
                spotst1: props.dataControllerState.predictiveModelInputs.spotst1,
                spotst2: props.dataControllerState.predictiveModelInputs.spotst2
            },
            outputs: {
                expSpotsIfOutbreak: props.dataControllerState.predictiveModelOutputs.expSpotsIfOutbreak,
                prob0spots: props.dataControllerState.predictiveModelOutputs.prob0spots,
                prob19spots: props.dataControllerState.predictiveModelOutputs.prob19spots,
                prob53spots: props.dataControllerState.predictiveModelOutputs.prob53spots,
                prob147spots: props.dataControllerState.predictiveModelOutputs.prob147spots,
                prob402spots: props.dataControllerState.predictiveModelOutputs.prob402spots,
                prob1095spots: props.dataControllerState.predictiveModelOutputs.prob1095spots
            }
        });
    }
}

export default ViewModelOutput