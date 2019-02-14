import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../styles/LoadingContainer.css';

class LoadingContainer extends Component {
    render() {
        return(
            <div className="flex-container" id="loading-container">
                <div className="container flex-item">
                    <div id="loading-gif-area">
                        <h2>Loading Data...</h2>
                        <img src={require("../assets/load-icon.gif")} width="150" height="150" alt="loading-gif"></img>
                    </div>

                    <div id="suggestion-section">
                        <p>Thanks for visiting the pine beetle prediction tool! Have a suggestion?</p>
                        <p>Let us know at <a href="mailto:pine-beetle@dali.dartmouth.edu">pine-beetle@dali.dartmouth.edu</a>.</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoadingContainer
