import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../../styles/About.css';

class About extends Component {
    render() {
        return(
            <div>
    			<div className="flex-container">
    				<div className="container about-project flex-item flex-item-left">
    					<h2>About the Project</h2>
                        <div className="line"></div>
                        <p>After developing a model at Dartmouth College to predict outbreaks and movements of Southern Pine Beetles, Professor Ayres and Aoki approached Dartmouth’s DALI Lab to design and develop a tool to visualize the trapping data and predictions gathered annually. This project aimes to deploy a product that field researchers, USFS personel, and the general public can use to understand trends in pine beetle movements.</p>
                        <div id="images-about">
                            <img src={require("../../assets/usfs.png")} id="usfs-img-about" alt="United States Forest Service Logo"></img>
                            <img src={require("../../assets/dartmouth.png")} id="dart-img-about" alt="Dartmouth College Logo"></img>
    						<img src={require("../../assets/sgsf.png")} id="sgfs-img-about" alt="Southern Group of State Foresters Logo"></img>
                        </div>
                        <p id="more-info-text">For information specifically about Southern Pine Beetles or various national forests, please contact the <em><a href="https://www.fs.fed.us/" target="_blank" rel="noopener noreferrer">US Forest Service.</a></em></p>
    				</div>
    				<div className="container using-product flex-item flex-item-right">
                        <h2>Using the Product</h2>
                        <div className="line"></div>
                        <p>To view the data, navigate to the <Link to="/viewdata"><strong><em>View Data</em></strong></Link> page. Here users can see graphical representations of the data as well as outbreak predictions and rankings from the statistical model. Use the selection boxes, slicers, and filters to adjust what data you are viewing. Users can adjust the range of years visualized as well as states, national forests, and local forests. Click the Reset Filters button to view all data.</p>
    					<p>Above the graphs is a geographic representation of the trapping data from ArcGIS. Adjust the top menu buttons to see data from different ranges and play around with the graph to see changes in recent years. Click the Expand Map button to move the prediction model down and view the map in full screen. Please see the contact information at right for feature requests. Please note this website uses cookies to enhance user experience. To learn more, please see the <a href="https://en.wikipedia.org/wiki/HTTP_cookie" target="_blank" rel="noopener noreferrer">following</a>.</p>
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
                            <p><strong>DALI Lab: </strong>Lorie Loeb, Director and Co-founder; Tim Tregubov, Co-founder. 18F: Madeline Hess, Developer; Isabel Hurley, Developer; Thomas Monfre, Project Manager/Developer. 19W: Mo Zhu, Project Manager; Madeline Hess, Developer; Thomas Monfre, Developer; Emi Hayakawa, Designer; Bella Jacoby, Designer.</p>
                        </div>
                    </div>

                    <div className="container contact-info flex-item flex-item-right">
                        <h2>Contact Information</h2>
                        <div className="line"></div>

                        <div id="contact-info-area">
                            <h4>Questions about the program</h4>
                            <div className="info-box">
                                <h3>Carissa Aoki</h3>
                                <a href="mailto:caoki@bates.edu">caoki@bates.edu</a>
                                <br></br>
                                <h3 id="pad-top">Matt Ayres</h3>
                                <a href="mailto:matthew.p.ayres@dartmouth.edu">matthew.p.ayres@dartmouth.edu</a>
                            </div>

                            <h4>Questions about local forests</h4>
                            <div className="info-box">
                                <h3>USDA Forest Service</h3>
                                <span>(800) 832-1355</span>
                            </div>

                            <h4>Questions about the tool</h4>
                            <div className="info-box">
                                <h3>Dartmouth DALI Lab</h3>
                                <a href="mailto:pine-beetle@dali.dartmouth.edu">pine-beetle@dali.dartmouth.edu</a>
                            </div>
                        </div>
                    </div>
                </div>
    		</div>
        );
    }
}

export default About
