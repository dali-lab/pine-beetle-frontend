import React, { Component } from 'react';
import { CSVLink } from "react-csv";
import ChoiceInput from './selection-bars/input-components/ChoiceInput.js';
import OptgroupChoiceInput from './selection-bars/input-components/OptgroupChoiceInput.js';
import '../styles/UploadDataFromSurvey123.css';
var jQuery = require("jquery");

class UploadDataFromSurvey123 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sentQuery: false,
            responseOutput: null,
            url: "",
            dataController: null,
            dataControllerState: null,
            stateName: null,
            nationalForest: null,
            forest: null,
            availableStates: [],
            availableModelYears: [],
            availableForestsByNF: {}
        }

        // bind functions
        this.uploadSurvey123Data = this.uploadSurvey123Data.bind(this);
        this.updateStateFromProps = this.updateStateFromProps.bind(this);
        this.updateStateSelection = this.updateStateSelection.bind(this);

        // create refs
        this.stateInput = React.createRef();
        this.forestInput = React.createRef();
    }

    render() {
        if (!this.props.lockedOut) {
            if (this.state.dataController !== null) {
                if (this.state.responseOutput !== null) {
                    return(
                        <div>
                            <div className="container">
                                <p>Click the button below to grab all submitted surveys from Survey123 and add them to the database.</p>
                                <p>Please be patient as this may take a few minutes to complete.</p>
                                <ChoiceInput instructions="Select State" submitFunction={this.state.dataController.updateStateSelection} availableOptions={this.state.availableStates} idName="state" value={this.state.stateName} ref={this.stateInput}/>
                                <OptgroupChoiceInput instructions="Select County / RD" submitFunction={this.state.dataController.updateForestSelection} availableOptions={this.state.availableForestsByNF} idName="forest" value={this.state.forest} ref={this.forestInput} showAboveText={true} />
                                <br />
                                <button id="survey123-button" className="submit static-button" onClick={this.uploadSurvey123Data}>Upload Survey123 Data</button>
        
                                <h3 id="survey123-top">Added the following to the database:</h3>
                                <div id="upload-output">{JSON.stringify(this.state.responseOutput)}</div>
        
                                <div id="survey123-csv">
                                    <CSVLink data={this.state.responseOutput} filename="uploaded-from-survey123">Click Here to Download the Added Data</CSVLink>
                                </div>
                            </div>
                        </div>
                    );
                }
                else if (this.state.error) {
                    return(
                        <div>
                            <div className="container">
                                <p>Click the button below to grab all submitted surveys from Survey123 and add them to the database.</p>
                                <p>Please be patient as this may take a few minutes to complete.</p>
                                <button id="survey123-button" className="submit static-button" onClick={this.uploadSurvey123Data}>Upload Survey123 Data</button>
                                <h3 id="survey123-top" style={{color: "red"}}>Failed to upload data to the database.</h3>
                                <p>Please email <a href="mailto:pine-beetle@dali.dartmouth.edu" id="survey123-email">pine-beetle@dali.dartmouth.edu</a> to report the error.</p>
                            </div>
                        </div>
                    );
                }
                else {
                    return(
                        <div className="container">
                            <p>Click the button below to grab all submitted surveys from Survey123 and add them to the database.</p>
                            <p>Please be patient as this may take a few minutes to complete.</p>
                            <ChoiceInput instructions="Select State" submitFunction={this.updateStateSelection} availableOptions={this.state.availableStates} idName="state" value={this.state.stateName} ref={this.stateInput}/>
                            <OptgroupChoiceInput instructions="Select County / RD" submitFunction={this.state.dataController.updateForestSelection} availableOptions={this.state.availableForestsByNF} idName="forest" value={this.state.forest} ref={this.forestInput} showAboveText={true} />
                            <br />
                            <button id="survey123-button" className="submit static-button" onClick={this.uploadSurvey123Data}>Upload Survey123 Data</button>
                        </div>
                    );
                }
            }
            else {
                return null;
            }
        }
        else {
            return (
                <div id="password-input-area">
                    <center>
                    <p>You are currently locked out from entering too many password attempts. Please try again in 30 minutes.</p>
                    </center>
                </div>
            )
        }
    }

    componentWillMount() {
        this.setState({
            url: this.props.url
        });
    }

    componentDidMount() {
        this.updateStateFromProps(this.props);
    }

    // if we are receiving new data, update the state before rendering
    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    // recalculate values to show on page
    updateStateFromProps(props) {
        if (props.dataControllerState !== null) {
            this.setState({
                dataController: props.dataController.current,
                dataControllerState: props.dataControllerState,
                stateName: props.dataControllerState.userFilters.stateName,
                forest: props.dataControllerState.userFilters.forest,
                availableStates: props.dataControllerState.dropDownContent.availableStates,
                availableForestsByNF: props.dataControllerState.dropDownContent.availableForestsByNF
            });
        }
    }

    updateStateSelection(value) {
        this.state.dataController.updateStateSelection(value);
    }

    uploadSurvey123Data() {
        if (!this.state.sentQuery) {
            var url = this.state.url + "uploadSurvey123Fake";
            var xmlHttp = new XMLHttpRequest();

            var filters = {
                state: this.state.stateName,
                forest: this.state.forest
            }

            xmlHttp.onload = function() {
                // if the request was successful hold onto the data
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                    this.setState({
                        responseOutput: xmlHttp.response,
                        sentQuery: true,
                        error: false
                    });
                }
                else {
                    this.setState({
                        error: true,
                        sentQuery: false,
                        responseOutput: null
                    });
                }
            }.bind(this);

            xmlHttp.open("POST", url, true);
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlHttp.responseType = 'json';
            xmlHttp.send(jQuery.param(filters));
        }
        else {
            alert("Already uploading data. Please be patient while we grab new survey entries.")
        }
    }
}

export default UploadDataFromSurvey123
