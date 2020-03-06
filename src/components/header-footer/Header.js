import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../../styles/fonts/font_stylesheet.css'
import '../../styles/Header.css';

class Header extends Component {
    render() {
        return(
            <div id="header">
                <div className="container">
                    <div id="title-area">
                        <div id="logo">
                            <Link to="/"><img src={require("../../assets/pinebeetle.png")} alt="logo"></img></Link>
                        </div>
                        <div id="nav-button-area">
                            <div id="nav-buttons">
                                <Link to="/historical-data"><p>HISTORICAL DATA</p></Link>
                                <Link to="/predictions"><p>PREDICTIVE MODEL</p></Link>
                                <Link to="/about"><p>ABOUT</p></Link>
                                <Link to="/how-it-works"><p>HOW IT WORKS</p></Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{clear:"both"}}></div>
            </div>
        );
    }
}

export default Header
