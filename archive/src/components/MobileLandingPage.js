import React, { Component } from 'react';
import '../styles/MobileLandingPage.css';

class MobileLandingPage extends Component {
    render() {
        return(
            <div id="mobile-landing-page">
                <img src={require("../assets/pinebeetle.png")} alt="logo"></img>
                <p><b>We apologize</b>, but this website is not compatible on mobile. Please navigate to a desktop to proceed. </p>
            </div>
        );
    }
}

export default MobileLandingPage