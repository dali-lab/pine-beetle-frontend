import React, { Component } from 'react';
import '../../styles/About.css';

class About extends Component {
    render() {
        return(
            <div>
    			<div className="flex-container flex-item flex-direction-column">
    				<div className="container about-project flex-item">
    					<h2>About the Project</h2>
                        <p>After developing a model at Dartmouth College to predict outbreaks and movements of Southern Pine Beetles, Professor Ayres and Aoki approached Dartmouth’s DALI Lab to design and develop a tool to visualize the trapping data and predictions gathered annually. This project aims to deploy a product that field researchers, USFS personel, and the general public can use to understand trends in pine beetle movements.</p>
    				</div>
    			</div>
                                    
                <div className="flex-container" id="bottom-area-about">
                    <div className="container flex-item flex-item-left" id="about-page-text">
                        <div className="header-text-container">
                            <h3>History</h3>
                            <p>This project carries on the work of Ron Billings of the Texas A&M University Forest Service (retired). Since 1987, Ron has coordinated annual predictions of summer SPB outbreak, based on spring trapping data provided by cooperators across the southern range of the beetle (Billings and Upton 2010). Our work builds on Ron’s tireless dedication to supporting and improving the prediction system over the past 30 years. </p>
                            <br />
                            <p id="special-about-italic">(Billings, R. F., and W. W. Upton. 2010. A methodology for assessing annual risk of southern pine beetle outbreaks across the southern region using pheromone traps. Pages 73–85 in J. M. Pye, H. M. Rauscher, Y. Sands, D. C. Lee, and J. S. Beatty, editors. Advances in threat assessment and their application to forest and rangeland management. Gen. Tech. Rep. PNW-GTR-802. Portland, OR: U.S. Department of Agriculture, Forest Service, Pacific Northwest and Southern Research Stations.)</p>
                        </div>
                        
                        <div className="header-text-container">
                            <h3>Partners and Cooperators</h3>
                            <p>The southern pine beetle prediction system is a collaboration of scores of people and institutions.</p>
                        </div>

                        <div className="header-text-container">
                            <h4>Project Committee:</h4>
                            <p>Matthew Ayres, Carissa Aoki, Steve Clark, Kevin Dodds, Lorie Loeb, John Nowak, Brian Sullivan, Michael Torbett</p>
                            <p>The creation of this resource for delivering SPB outbreak predictions was supported by a grant from the U.S.D.A. Forest Service Special Technology Development Program (STDP) to MP Ayres and CF Aoki at Dartmouth College.</p>
                        </div>

                        <div className="header-text-container">
                            <h4>U.S.D.A. Forest Service: </h4>
                            <p>Steve Clark, Entomologist; John Nowak, Entomologist, Southern Pine Beetle Prevention Program Coordinator; Brian Sullivan, Entomologist</p>
                        </div>

                        <div className="header-text-container">
                            <h4>State Cooperators: </h4>
                            <p>Alabama Forestry Commission: Dana Stone; Arkansas Forestry Commission: Chandler Barton; Florida Forest Service: Jeff Eickwort and Chris Pearce; Georgia Forestry Commission: Michael Torbett and Chip Bates; Louisiana Department of Agriculture and Forestry: Brent Cutrer; Mississippi Forestry Commission: Todd Matthews; North Carolina Forest Service: Rob Trickel; South Carolina Forestry Commission: David Jenkins; Tennessee Division of Forestry: Nathan Hoover; Texas A&M Forest Service: Shane Harrington; Virginia Department of Forestry: Lori Chamberlin</p>
                        </div>

                        <div className="header-text-container">
                            <h4>DALI Lab:</h4>
                            <p>Web design and development by the Dartmouth Applied Learning and Innovation (DALI) Lab at Dartmouth College. Lorie Loeb, Director and Co-founder; Madeline Hess, Developer; Thomas Monfre, Developer; Isabel Hurley, Developer; Mo Zhu, Team Manager; Bella Jacoby, Designer; Emi Hayakawa, Designer; John MacDonald '22, Developer.</p>
                        </div>

                        <div id="image-icon-area">
                            <img src={ require('../../assets/usfs.png') } height = "200px" width = "170px" alt="usfs-logo" />
                            <img src={ require('../../assets/sgsf.png') } height = "200px" width = "120px" alt="sgsf-logo" />
                            <img src={ require('../../assets/dali_dark.png') } height = "100px" width = "270px" id="dali-low" alt="dali-logo" />
                        </div>
                    </div>

                    <div className="flex-item flex-item-right" id="about-right-container">
                        <div id="person">
                          <img src={ require('../../assets/person.png') } height = "200px" width = "200px" alt="ron" />
                        </div>

                        <div id="contact-info">
                            <h3 id="contact-info-header">Contact Information</h3>
                            <div id="contact-info-area">
                                <div className="info-box">
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
            </div>
        );
    }
}

export default About
