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
    					<div id="selection-buttons">
                            <Link to="/about" id="button-left">Learn More</Link>
                            <Link to="/viewdata" id="button-right">View Data</Link>
    					</div>
    				</div>

    				<div className="container data-preview flex-item flex-item-right">
    					<h2 id="current-location">Nationwide Predictions</h2>
    					<div id="calculations">
    						<div id="outbreak-prob">
    							<h1 className="medium">74%</h1>
    							<h4>probability of over 54 spots</h4>
    						</div>
    						<div id="outbreak-risk">
    							<h1 className="high">175</h1>
    							<h4>expected spots if outbreak</h4>
    						</div>
    					</div>
    					<p id="more-info-text">Navigate to the <em><Link to="/viewdata">View Data</Link></em> page for more detailed metrics.</p>
    				</div>
    			</div>

    			<div className="flex-container">
    				<div className="container flex-item flex-item-left" id="partners-cooperators">
    					<h2>Partners & Cooperators</h2>
    					<div className="line"></div>
    					<div id="text">
    						<p>The southern pine beetle prediction system is a collaboration of scores of people and institutions.</p>
    						<p><strong>Project Committee: </strong>Matthew Ayres, Carissa Aoki, Steve Clark, Kevin Dodds, Lorie Loeb, John Nowak, Brian Sullivan, Michael Torbett.</p>
    						<p>The creation of this resource for delivering SPB outbreak predictions was supported by a grant from the U.S.D.A. Forest Service Special Technology Development Program (STDP) to MP Ayres and CF Aoki at Dartmouth College.</p>
    						<p>Web design and development by the Dartmouth Applied Learning and Innovation (DALI) Lab at Dartmouth College.</p>
    						<p>The southwide SPB surveys and prediction system conceived and developed beginning in 1988 by Ronald Billings, Texas A&M University Forest Service, retired.</p>
    						<p><strong>USDA Forest Service: </strong>Steve Clark, Entomologist; John Nowak, Entomologist, Southern Pine Beetle Prevention Program Coordinator; Brian Sullivan, Entomologist.</p>
    						<p><strong>State Cooperators: </strong>Alabama Forestry Commission: Dana Stone; Arkansas Forestry Commission: Chandler Barton; Florida Forest Service: Jeff Eickwort and Chris Pearce; Georgia Forestry Commission: Michael Torbett and Chip Bates; Louisiana Department of Agriculture and Forestry: Brent Cutrer; Mississippi Forestry Commission: Todd Matthews; North Carolina Forest Service: Rob Trickel; South Carolina Forestry Commission: David Jenkins; Tennessee Division of Forestry: Nathan Hoover; Texas A&M Forest Service: Shane Harrington; Virginia Department of Forestry: Lori Chamberlin.</p>
    						<p><strong>DALI Lab: </strong>Lorie Loeb, Director and Co-founder; Madeline Hess, Developer; Isabel Hurley, Developer; Thomas Monfre, Project Manager/Developer.</p>
    					</div>
    				</div>
    				<div className="container flex-item flex-item-right" id="images">
    					<img id="sgfs-img" src={require("../assets/sgsf.png")} height="220px" width="140px" alt="Southern Group of State Foresters"></img>
    					<img id="usfs-img" src={require("../assets/usfs.png")} height="200px" width="183px" alt="United States Forest Service"></img>
    					<img id="dart-img" src={require("../assets/dartmouth.png")} height="180px" width="180px" alt="Dartmouth College"></img>
    				</div>
    			</div>
    		</div>
        );
    }
}

export default Home
