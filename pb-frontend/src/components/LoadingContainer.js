import React, { Component } from 'react';
import '../styles/historical-data/LoadingContainer.css';

class LoadingContainer extends Component {
    render() {
        return(
            <div className="flex-container" id="loading-container">
                <div className="container flex-item">
                    <h2>Loading Data...</h2>
                    <img src={require("../assets/load-icon.gif")} width="150" height="150" alt="loading-gif"></img>
                    <p>Insert fun fact about pine beetle here?</p>
                </div>
            </div>
        );
    }
}

export default LoadingContainer
