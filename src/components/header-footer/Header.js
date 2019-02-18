import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../../styles/Header.css';

class Header extends Component {
    render() {
        return(
            <div id="header">
              <div className="container">
        				<div id="title-area">
                  <div id="logo">
        				    <Link to="/"><img src={require("../../assets/pinebeetle.png")}></img></Link>
                  </div>
        				  <div id="nav-button-area">
        				    <div id="nav-buttons">
  		                <Link to="/"><p>HISTORICAL DATA</p></Link>
                      <Link to="/predictions"><p id="middle">PREDICTIVE MODEL</p></Link>
      				        <Link to="/about"><p>ABOUT</p></Link>
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
