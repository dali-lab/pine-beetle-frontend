import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../styles/Home.css';

class Home extends Component {
    render() {
        return(
            <div>
    			<div className="flex-container">
    				<div className="container landing-text flex-item flex-item-left">
    					<em><h1>Predicting Southern Pine Beetle Outbreaks</h1></em>
    					<div className="line"></div>
    					<p id="p-tight">This prototype exhibits the first steps in a months-long process to develop a fully deployed tool to visualize and predict  trends in Southern Pine Beetle movements throughout the United States.</p>
						<p>This content will change -- see Bella</p>
    					<div id="selection-buttons">
                            <Link to="/about" id="button-left">Learn More</Link>
                            <Link to="/viewdata" id="button-right">View Data</Link>
    					</div>
    				</div>
    			</div>
    		</div>
        );
    }
}

export default Home
