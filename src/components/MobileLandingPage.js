import React, { Component } from 'react';
import '../styles/MobileLandingPage.css';

class MobileLandingPage extends Component {
    render() {
        return(
            <div id="mobile-landing-page">
                <h2>Uh oh!</h2>
                <p>This website is not compatible on mobile.</p>
                <p>Please navigate to a desktop to proceed.</p>
            </div>
        );
    }
}

export default MobileLandingPage
