import React, { Component } from 'react';
import TimelineInput from '../selection-bars/input-components/TimelineInput.js';
import TextInput from '../selection-bars/input-components/TextInput.js';
import '../../styles/predictive-model-page/ModelInputArea.css';

class ModelInputArea extends Component {
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
        if (this.state.dataControllerState !== null && this.state.dataController !== null) {
            return(
                <div className="flex-container">
                    <div className="flex-item-left container" id="timeline">
                        <div id="timeline-area">
                            <ol>
                                <li>
                                    <p class="timeline-title">{this.state.dataControllerState.userFilters.predictiveModelDate - 2}</p>
                                    <span class="point"></span>
                                    <div class="description">
                                        <TimelineInput instructions="Spots" submitFunction={this.updateSpotst2Selection} valueToDisplay={this.state.inputs.spotst2 !== null ? this.state.inputs.spotst2 : "null"} ref={this.spotst2Input} />
                                    </div>
                                </li>
                                <li id="special-li-timeline">
                                    <p class="timeline-title">{this.state.dataControllerState.userFilters.predictiveModelDate - 1}</p>
                                    <span class="point"></span>
                                    <div class="description">
                                        <table>
                                            <tr>
                                                <th><TimelineInput instructions="Clerids" submitFunction={this.updateCleridst1Selection} valueToDisplay={this.state.inputs.cleridst1 !== null ? this.state.inputs.cleridst1 : "null"} ref={this.cleridst1Input} /></th>
                                                <th><TimelineInput instructions="Spots" submitFunction={this.updateSpotst1Selection} valueToDisplay={this.state.inputs.spotst1 !== null ? this.state.inputs.spotst1 : "null"} ref={this.spotst1Input} /></th>
                                            </tr>
                                        </table>
                                    </div>
                                </li>
                                <li>
                                    <p class="timeline-title">{"Spring " + this.state.dataControllerState.userFilters.predictiveModelDate}</p>
                                    <span class="point"></span>
                                    <div class="description">
                                        <TimelineInput instructions="SPB" submitFunction={this.updateSPBSelection} valueToDisplay={this.state.inputs.SPB !== null ? this.state.inputs.SPB : "null"} ref={this.SPBInput} />
                                    </div>
                                </li>
                                <li>
                                    <div className="description">
                                        <TimelineInput instructions="endobrev" submitFunction={this.updateEndobrevSelection} valueToDisplay={this.state.inputs.endobrev !== null ? this.state.inputs.endobrev : "null"} ref={this.endobrevInput} />
                                    </div>
                                </li>
                                <li id="timeline-button">
                                    <div className="description" id="timeline-button-description">
                                        <table>
                                            <tr>
                                                <th><button id="reset-current-data-button" className="submit static-button" onClick={this.getCustomModelOutputs}>Run Model</button></th>
                                                <th><button id="reset-current-data-button" className="submit static-button" onClick={this.props.dataController.resetModelSelections}>Reset Values</button></th>
                                            </tr>
                                        </table>
                                        
                                    </div>
                                </li>
                            </ol>
                        </div>
                    </div>
                    <div className="flex-item-right container" id="box-info-area">
                        <div id="print-model-outputs">
                            <p>{"# of Spots in " + (this.state.dataControllerState.userFilters.predictiveModelDate - 1) + ": "}<strong>{this.state.dataControllerState.predictiveModelInputs.spotst1}</strong></p>
                            <p>{"Expected # of Spots in " + this.state.dataControllerState.userFilters.predictiveModelDate + ": "}<strong>{this.state.dataControllerState.predictiveModelOutputs.expSpotsIfOutbreak}</strong></p>
                        </div>
                        <div id="prob-any-spots">
                            <p>{"Probability of Any Spots: "}<strong style={{color: "red"}}>{(this.state.dataControllerState.predictiveModelOutputs.prob0spots*100).toFixed(2) + "%"}</strong></p>
                        </div>
                    </div>
                </div>
            );   
        }
        else {
            return null;
        }
    }

    // <div className="container dropdown-bar" id="pred-model-filters">
    //     <div id="selection-areas-view-data">
    //         <TextInput instructions="SPB" submitFunction={this.updateSPBSelection} valueToDisplay={this.state.inputs.SPB !== null ? this.state.inputs.SPB : "null"} ref={this.SPBInput} />
    //         <TextInput instructions="cleridst1" submitFunction={this.updateCleridst1Selection} valueToDisplay={this.state.inputs.cleridst1 !== null ? this.state.inputs.cleridst1 : "null"} ref={this.cleridst1Input} />
    //         <TextInput instructions="spotst1" submitFunction={this.updateSpotst1Selection} valueToDisplay={this.state.inputs.spotst1 !== null ? this.state.inputs.spotst1 : "null"} ref={this.spotst1Input} />
    //         <TextInput instructions="spotst2" submitFunction={this.updateSpotst2Selection} valueToDisplay={this.state.inputs.spotst2 !== null ? this.state.inputs.spotst2 : "null"} ref={this.spotst2Input} />
    //         <TextInput instructions="endobrev" submitFunction={this.updateEndobrevSelection} valueToDisplay={this.state.inputs.endobrev !== null ? this.state.inputs.endobrev : "null"} ref={this.endobrevInput} />

    //         <button id="reset-current-data-button" className="submit static-button" onClick={this.getCustomModelOutputs}>Run Model</button>
    //         <button id="reset-current-data-button" className="submit static-button" onClick={this.props.dataController.resetModelSelections}>Reset Values</button>
    //     </div>
    // </div>

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

export default ModelInputArea