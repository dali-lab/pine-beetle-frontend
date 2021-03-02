import React from 'react';

import './style.scss';

const About = (_props) => {
  return (
    <div id="about-content">
      <div className="container" id="overview-text">
        <h1 id="title">About The Project</h1>
      </div>
      <div className="about-content-container">
        <h2>History</h2>
        <p>This project carries on the work of Ron Billings of the Texas A&M University Forest Service (retired). Since 1987, Ron has
          coordinated annual predictions of summer SPB outbreak, based on spring trapping data provided by cooperators across the southern
          range of the beetle (Billings and Upton 2010). Our work builds on Ron’s tireless dedication to supporting and improving the prediction
          system over the past 30 years.
        </p>
        <p style={{ fontStyle: 'italic', fontSize: 14 }}>(Billings, R. F., and W. W. Upton. 2010. A methodology for assessing annual risk of southern pine beetle outbreaks across the southern
          region using pheromone traps. Pages 73–85 in J. M. Pye, H. M. Rauscher, Y. Sands, D. C. Lee, and J. S. Beatty, editors. Advances in
          threat assessment and their application to forest and rangeland management. Gen. Tech. Rep. PNW-GTR-802. Portland, OR: U.S. Department
          of Agriculture, Forest Service, Pacific Northwest and Southern Research Stations.)
        </p>
      </div>
      <div className="about-content-container">
        <h2>Partners & Cooperators</h2>
        <p>The southern pine beetle prediction system is a collaboration of scores of people and institutions.</p>
        <h3>Project Committee:</h3>
        <p>Matthew Ayres, Carissa Aoki, Steve Clark, Kevin Dodds, Lorie Loeb, John Nowak, Brian Sullivan, Michael Torbett</p>
        <p>The creation of this resource for delivering SPB outbreak predictions was supported by a grant from the U.S.D.A.
          Forest Service Special Technology Development Program (STDP) to MP Ayres and CF Aoki at Dartmouth College.
        </p>
        <h3>U.S.D.A. Forest Service:</h3>
        <p>Steve Clark, Entomologist; John Nowak, Entomologist, Southern Pine Beetle Prevention Program Coordinator; Brian Sullivan, Entomologist</p>
        <h3>State Cooperators:</h3>
        <p>Alabama Forestry Commission: Dana Stone; Arkansas Forestry Commission: Chandler Barton; Florida Forest Service: Jeff Eickwort and Chris Pearce;
          Georgia Forestry Commission: Michael Torbett and Chip Bates; Louisiana Department of Agriculture and Forestry: Brent Cutrer; Mississippi Forestry
          Commission: Todd Matthews; North Carolina Forest Service: Rob Trickel; South Carolina Forestry Commission: David Jenkins; Tennessee Division of
          Forestry: Nathan Hoover; Texas A&M Forest Service: Shane Harrington; Virginia Department of Forestry: Lori Chamberlin
        </p>
        <h3>DALI Lab:</h3>
        <p>Web design and development by the Dartmouth Applied Learning and Innovation (DALI) Lab at Dartmouth College.
          Thomas Monfre, Developer; Jeff Liu, Developer; Angela Zhang, Developer; Hannah Utter, Team Manager;
          Barkin Cavdaroglu, Designer; Darley Sackitey, Designer and Animator. Project members from previous iterations: Nathan Schneider, Developer;
          John McCambridge, Developer; Madeline Hess, Developer; Isabel Hurley, Developer; Anuj Varma, Team Manager; Emma Langfitt, Designer and Developer.
        </p>
      </div>
      <div className="about-content-container">
        <h2>Grant</h2>
        <p>Supported by the National Science Foundation under Award ID 1917002.</p>
      </div>
      <div className="about-content-container">
        <h2>Contact Information</h2>
        <h3>Questions about the program</h3>
        <p>Carissa Aoki: <a href="mailto:caoki@bates.edu">caoki@bates.edu</a></p>
        <p>Matthew Ayres: <a href="mailto:matthew.p.ayres@dartmouth.edu">matthew.p.ayres@dartmouth.edu</a>
        </p>
        <h3>Questions about local forests</h3>
        <p>US Forest Service: (800) 832-1355</p>
        <h3>Questions about the tool</h3>
        <p>Dartmouth DALI Lab: <a href="mailto:pine-beetle@dali.dartmouth.edu">pine-beetle@dali.dartmouth.edu</a></p>
      </div>
    </div>
  );
};

export default About;
