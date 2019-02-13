import React, { Component } from 'react';
import '../../styles/Footer.css';

class Footer extends Component {
    render() {
        return(
            <div id="footer">
                <div className="container">
                    <a href="http://dali.dartmouth.edu/" target="_blank" rel="noopener noreferrer"><img id="dali-logo" src={require("../../assets/dali_dark.png")} width="102px" height="39px" alt="DALI Lab Logo"></img></a>
                </div>
                <div style={{clear:"both"}}></div>
            </div>
        );
    }
}

export default Footer
