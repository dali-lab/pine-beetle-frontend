import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../../styles/About.css';

class About extends Component {
    render() {
        return(
            <div>
    			<div className="flex-container flex-item flex-direction-column">
    				<div className="container about-project flex-item flex-item-left">
    					<h2>About the Project</h2>
                  <p>After developing a model at Dartmouth College to predict outbreaks and movements of Southern Pine Beetles, Professor Ayres and Aoki approached Dartmouth’s DALI Lab to design and develop a tool to visualize the trapping data and predictions gathered annually. This project aimes to deploy a product that field researchers, USFS personel, and the general public can use to understand trends in pine beetle movements.</p>
    				</div>
    				<div className="container using-product flex-item flex-item-right">
                        <div className="history flex-item flex-grow-3">
                          <h2>History</h2>
                          <p>This project carries on the work of Ron Billings of the Texas A&M University Forest Service (retired). Since 1987, Ron has coordinated annual predictions of summer SPB outbreak, based on spring trapping data provided by cooperators across the southern range of the beetle (Billings and Upton 2010). Our work builds on Ron’s tireless dedication to supporting and improving the prediction system over the past 30 years. </p>
                          <p>(Billings, R. F., and W. W. Upton. 2010. A methodology for assessing annual risk of southern pine beetle outbreaks across the southern region using pheromone traps. Pages 73–85 in J. M. Pye, H. M. Rauscher, Y. Sands, D. C. Lee, and J. S. Beatty, editors. Advances in threat assessment and their application to forest and rangeland management. Gen. Tech. Rep. PNW-GTR-802. Portland, OR: U.S. Department of Agriculture, Forest Service, Pacific Northwest and Southern Research Stations.)</p>
                        </div>
                        <div className = "person flex-item">
                          <img src={ require('../../assets/person.png') } height = "200px" width = "200px" />
                        </div>
                    </div >
    			</div>
                                    
                <div className="flex-container bottom;">
                    <div className="container next-steps flex-item flex-item-left">
                        <h2>Partners and Cooperators</h2>
                        <p>The southern pine beetle prediction system is a collaboration of scores of people and institutions.</p>

                        <h3>Project Committee:</h3>
                        <p>Matthew Ayres, Carissa Aoki, Steve Clark, Kevin Dodds, Lorie Loeb, John Nowak, Brian Sullivan, Michael Torbett</p>
                        <p>The creation of this resource for delivering SPB outbreak predictions was supported by a grant from the U.S.D.A. Forest Service Special Technology Development Program (STDP) to MP Ayres and CF Aoki at Dartmouth College.</p>

                        <h3>U.S.D.A. Forest Service: </h3>
                        <p>Steve Clark, Entomologist; John Nowak, Entomologist, Southern Pine Beetle Prevention Program Coordinator; Brian Sullivan, Entomologist</p>

                        <h3>State Cooperators: </h3>
                        <p>Alabama Forestry Commission: Dana Stone; Arkansas Forestry Commission: Chandler Barton; Florida Forest Service: Jeff Eickwort and Chris Pearce; Georgia Forestry Commission: Michael Torbett and Chip Bates; Louisiana Department of Agriculture and Forestry: Brent Cutrer; Mississippi Forestry Commission: Todd Matthews; North Carolina Forest Service: Rob Trickel; South Carolina Forestry Commission: David Jenkins; Tennessee Division of Forestry: Nathan Hoover; Texas A&M Forest Service: Shane Harrington; Virginia Department of Forestry: Lori Chamberlin</p>

                        <h3>DALI Lab:</h3>
                        <p>Web design and development by the Dartmouth Applied Learning and Innovation (DALI) Lab at Dartmouth College. Lorie Loeb, Director and Co-founder; Madeline Hess, Developer; Thomas Monfre, Developer; Isabel Hurley, Developer; Mo Zhu, Team Manager; Bella Jacoby, Designer; Emi Hayakawa, Designer</p>
                    </div>

                    <div className="container contact-info flex-item flex-item-right">
                        <h2>Contact Information</h2>
                        <div id="contact-info-area">
                            <div className="info-box flex-wrap-wrap">
                                <h4>Questions about the program</h4>
                                <h3>Carissa Aoki</h3>
                                <a href="mailto:caoki@bates.edu">caoki@bates.edu</a>
                                <br></br>
                                <h3 id="pad-top">Matt Ayres</h3>
                                <a href="mailto:matthew.p.ayres@dartmouth.edu">matthew.p.ayres@dartmouth.edu</a>
                            </div>

                            <div className="info-box">
                                <h4>Questions about local forests</h4>
                                <h3>US Forest Service</h3>
                                <span>(800) 832-1355</span>
                            </div>

                            <div className="info-box">
                                <h4>Questions about the tool</h4>
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
