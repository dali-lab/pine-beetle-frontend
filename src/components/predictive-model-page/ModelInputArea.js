import React, { Component } from 'react';
import TimelineInput from '../selection-bars/input-components/TimelineInput.js';
import TextInput from '../selection-bars/input-components/TextInput.js';
import '../../styles/predictive-model-page/ModelInputArea.css';
var $ = require("jquery");

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
        this.editValues = this.editValues.bind(this);
        this.resetValues = this.resetValues.bind(this);

        this.SPBInput = React.createRef();
        this.cleridst1Input = React.createRef();
        this.spotst1Input = React.createRef();
        this.spotst2Input = React.createRef();
        this.endobrevInput = React.createRef();
    }

    render() {
        if (this.state.dataControllerState !== null && this.state.dataController !== null) {
            return(
                <div className="flex-container" id="model-input-area">
                    <div className="flex-item-left container" id="timeline">
                        <div id="timeline-area">
                            <ol>
                                <li>
                                    <h3 class="timeline-title">{this.state.dataControllerState.userFilters.predictiveModelDate - 2}</h3>
                                    <span class="point"></span>
                                    <div class="description" id="spots-input-pred">
                                        <TimelineInput instructions="Spots" submitFunction={this.updateSpotst2Selection} valueToDisplay={this.state.inputs.spotst2 !== null ? this.state.inputs.spotst2 : "null"} ref={this.spotst2Input} />
                                    </div>
                                </li>
                                <li id="special-li-timeline">
                                    <h3 class="timeline-title">{this.state.dataControllerState.userFilters.predictiveModelDate - 1}</h3>
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
                                <li id="special-li-timeline">
                                    <h3 class="timeline-title">{"Spring " + this.state.dataControllerState.userFilters.predictiveModelDate}</h3>
                                    <span class="point"></span>
                                    <div class="description">
                                        <table>
                                            <tr>
                                                <th><TimelineInput instructions="SPB" submitFunction={this.updateSPBSelection} valueToDisplay={this.state.inputs.SPB !== null ? this.state.inputs.SPB : "null"} ref={this.SPBInput} /></th>
                                                <th><TimelineInput instructions="endobrev" submitFunction={this.updateEndobrevSelection} valueToDisplay={this.state.inputs.endobrev !== null ? this.state.inputs.endobrev : "null"} ref={this.endobrevInput} /></th>
                                            </tr>
                                        </table>
                                    </div>
                                </li>
                                <li id="timeline-button">
                                    <div className="description" id="timeline-button-description">
                                        <table>
                                            <tr>
                                                <th><button id="pred-model-button" className="submit static-button" onClick={this.editValues}>EDIT VALUES</button></th>
                                                <th><button id="pred-model-button" className="submit static-button" onClick={this.resetValues}>RESET VALUES</button></th>
                                                <th><button id="pred-model-button" className="submit static-button" onClick={this.getCustomModelOutputs}>RUN MODEL</button></th>
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
                            <div className="line"></div>
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
        if (isNaN(this.SPBInput.current.state.value)) {
            var SPB = this.state.inputs.SPB
        }
        else {
            var SPB = this.SPBInput.current.state.value
        }

        if (isNaN(this.cleridst1Input.current.state.value)) {
            var cleridst1 = this.state.inputs.cleridst1
        }
        else {
            var cleridst1 = this.cleridst1Input.current.state.value
        }

        if (isNaN(this.spotst1Input.current.state.value)) {
            var spotst1 = this.state.inputs.spotst1
        }
        else {
            var spotst1 = this.spotst1Input.current.state.value
        }

        if (isNaN(this.spotst2Input.current.state.value)) {
            var spotst2 = this.state.inputs.spotst2
        }
        else {
            var spotst2 = this.spotst2Input.current.state.value
        }

        if (isNaN(this.endobrevInput.current.state.value)) {
            var endobrev = this.state.inputs.endobrev
        }
        else {
            var endobrev = this.endobrevInput.current.state.value
        }

        var inputs = {
            SPB: SPB,
            cleridst1: cleridst1,
            spotst1: spotst1,
            spotst2: spotst2,
            endobrev: endobrev
        }

        this.props.dataController.getCustomModelOutputs(inputs)
        $("#timeline li .description input").css("background-color", "#f4f4f4");
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

    resetValues() {
        this.props.dataController.resetModelSelections();
        $("#timeline li .description input").css("background-color", "#f4f4f4");
    }

    editValues() {
        if ($("#timeline li .description input").css("background-color") === "rgb(244, 244, 244)") {
            $("#timeline li .description input").css("background-color", "#CCE1B6");

            var inputs = {
                SPB: 0,
                cleridst1: 0,
                spotst1: 0,
                spotst2: 0,
                endobrev: 1
            }

            this.setState({
                inputs: inputs
            });

        }
        else {
            $("#timeline li .description input").css("background-color", "#f4f4f4");
            // this.props.dataController.resetModelSelections();
        }
    }
}

export default ModelInputArea