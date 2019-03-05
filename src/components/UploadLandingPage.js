import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import '../styles/UploadLandingPage.css';
require('dotenv').config() // load correct password

class UploadLandingPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: "",
            tryCount: 0,
            correct: false,
        }

        // bind functions
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.setValue = this.setValue.bind(this);
        this.submit = this.submit.bind(this);
    }
    render() {
        if (this.props.lockedOut) {
            return (
                <div id="password-input-area">
                    <center>
                    <p>You are currently locked out from entering too many password attempts. Please try again in 30 minutes.</p>
                    </center>
                </div>
            )
        }
        else if (this.state.correct) {
            return <Redirect to={this.props.passwordProtectedPageRoute}/>
        }
        else {
            return (
                <div id="password-input-area">
                    <center>
                    <h3>Enter Password To Upload Data</h3>
                    <input className="input" type="password" name="fname" placeholder="Password" value={this.state.value} onChange={this.setValue} onClick={this.selectText} onKeyPress={this.handleKeyPress}></input>
                    <button className="submit" onClick={this.submit}>Submit</button>
                    </center>
                </div>
            )
        }
    }

    // update the held state in the input field
    setValue(event) {
        this.setState({
            value: event.target.value
        });
    }

    // submit a new value for the given selection
    submit(event) {
        if (this.state.tryCount === 5) {
            this.setCookie("upload-locked-out", "true", 30);
            alert("You've reached the maximum number of password attempts. Please try again.")
            this.props.setLockout(true);
        }
        else {
            this.setState({
                tryCount: this.state.tryCount + 1
            }, () => {
                if (this.state.value === process.env.REACT_APP_UPLOAD_PASSWORD) {
                    this.setState({
                        correct: true
                    });
                }
                else {
                    alert("Wrong password. Please try again.")
                }
            });
        }
    }

    // highlight the text field on user click
    selectText(event) {
        event.target.select();
    }

    // if user presses enter in the input field, click the submit button for them
    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.submit();
        }
    }

    // source: https://www.w3schools.com/js/js_cookies.asp
    setCookie(cname, cvalue, numMinutes) {
        var d = new Date();
        d.setTime(d.getTime() + (numMinutes*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
}

export default UploadLandingPage
