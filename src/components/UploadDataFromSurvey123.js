import React, { Component } from 'react';
import '../styles/UploadDataFromSurvey123.css';

class UploadDataFromSurvey123 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sentQuery: false,
            responseOutput: null,
            url: ""
        }

        this.uploadSurvey123Data = this.uploadSurvey123Data.bind(this);
    }

    render() {
        if (this.state.responseOutput !== null) {
            return(
                <div>
                    <div className="container">
                        <p>Click the button below to grab all submitted surveys from Survey123 and add them to the database.</p>
                        <p>Please be patient as this may take a few minutes to complete.</p>
                        <button id="survey123-button" className="submit static-button" onClick={this.uploadSurvey123Data}>Upload Survey123 Data</button>
                        <h3 id="survey123-top">Added the following to the database:</h3>
                        {JSON.stringify(this.state.responseOutput)}
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
                    <button id="survey123-button" className="submit static-button" onClick={this.uploadSurvey123Data}>Upload Survey123 Data</button>
                </div>
            );
        }

        
    }

    componentWillMount() {
        this.setState({
            url: this.props.url
        });
    }

    uploadSurvey123Data() {
        if (!this.state.sentQuery) {
            var url = this.state.url + "uploadSurvey123Fake";
            var xmlHttp = new XMLHttpRequest();

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
            xmlHttp.send();
        }
        else {
            alert("Already uploading data. Please be patient while we grab new survey entries.")
        }
    }
}

export default UploadDataFromSurvey123
