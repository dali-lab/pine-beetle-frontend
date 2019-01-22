import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../../styles/Header.css';

class Header extends Component {
    render() {
        return(
            <div id="header">
                <div className="container">
    				<div id="title-area">
    					<Link to="/"><h1>Pine Beetle Prediction Tool</h1></Link>
    				</div>
    				<div id="nav-button-area">
    					<div id="nav-buttons">
    						<Link to="/"><p>HOME</p></Link>
    						<Link to="/viewdata"><p id="middle">HISTORICAL DATA</p></Link>
                            <Link to="/predictions"><p id="middle">PREDICTIVE MODEL</p></Link>
    						<Link to="/about"><p>ABOUT</p></Link>
    					</div>
    				</div>
                </div>
                <div style={{clear:"both"}}></div>
            </div>
        );
    }
}

export default Header
