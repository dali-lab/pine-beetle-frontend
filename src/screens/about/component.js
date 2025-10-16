import React from 'react';

import './style.scss';

const About = (_props) => {
  return (
    <div id="about-content">
      <div className="page-header">
        <h1>About The Project</h1>
        <p className="page-description">
          Learn about the Southern Pine Beetle prediction system, its history, partners, and the collaborative effort behind this important forest management tool.
        </p>
      </div>

      <div className="about-content-container">
        <section className="about-section">
          <h2>Project Overview</h2>
          <p className="lead-text">
            The Southern Pine Beetle prediction system represents over three decades of collaborative research and forest management innovation.
            This web-based tool provides forest managers with critical data to anticipate and respond to beetle outbreaks across the southern United States.
          </p>
        </section>

        <section className="about-section">
          <h2>Historical Foundation</h2>
          <p>
            This project builds upon the foundational work of <strong>Ron Billings</strong> of the Texas A&M University Forest Service (retired).
            Since 1987, Ron coordinated annual predictions of summer SPB outbreaks based on spring trapping data provided by cooperators
            across the southern range of the beetle.
          </p>
          <p>
            Our current system continues this legacy, incorporating modern statistical methods and web technologies to make these
            predictions more accessible and actionable for forest managers.
          </p>
          <div className="citation">
            <p>
              <em>Reference:</em> Billings, R. F., and W. W. Upton. 2010. A methodology for assessing annual risk of southern pine beetle outbreaks
              across the southern region using pheromone traps. Pages 73–85 in J. M. Pye, H. M. Rauscher, Y. Sands, D. C. Lee, and J. S. Beatty,
              editors. Advances in threat assessment and their application to forest and rangeland management. Gen. Tech. Rep. PNW-GTR-802.
              Portland, OR: U.S. Department of Agriculture, Forest Service, Pacific Northwest and Southern Research Stations.
            </p>
          </div>
        </section>

        <section className="about-section">
          <h2>Collaborative Network</h2>
          <p className="section-intro">
            The southern pine beetle prediction system represents a collaboration of researchers, forest managers, and institutions
            working together to protect forest resources.
          </p>

          <div className="collaboration-list">
            <div className="collaboration-item project-committee">
              <h3>Project Committee</h3>
              <div className="committee-members">
                <div className="member-group">
                  <h4>Principal Investigators</h4>
                  <p>Matthew Ayres, Carissa Aoki</p>
                </div>
                <div className="member-group">
                  <h4>Research Team</h4>
                  <p>Steve Clark, Kevin Dodds, Lorie Loeb, John Nowak, Brian Sullivan, Michael Torbett</p>
                </div>
              </div>
              <div className="funding-info">
                <p>Supported by the U.S.D.A. Forest Service Special Technology Development Program (STDP)</p>
              </div>
            </div>

            <div className="collaboration-item">
              <h3>U.S.D.A. Forest Service</h3>
              <div className="member-list">
                <div className="member-item">
                  <strong>Steve Clark</strong> - Entomologist
                </div>
                <div className="member-item">
                  <strong>John Nowak</strong> - Entomologist, Southern Pine Beetle Prevention Program Coordinator
                </div>
                <div className="member-item">
                  <strong>Brian Sullivan</strong> - Entomologist
                </div>
              </div>
            </div>

            <div className="collaboration-item">
              <h3>State Forestry Agencies</h3>
              <div className="state-grid">
                <div className="state-item">
                  <strong>Alabama:</strong> Dana Stone (Alabama Forestry Commission)
                </div>
                <div className="state-item">
                  <strong>Arkansas:</strong> Chandler Barton (Arkansas Forestry Commission)
                </div>
                <div className="state-item">
                  <strong>Florida:</strong> Jeff Eickwort and Chris Pearce (Florida Forest Service)
                </div>
                <div className="state-item">
                  <strong>Georgia:</strong> Michael Torbett and Chip Bates (Georgia Forestry Commission)
                </div>
                <div className="state-item">
                  <strong>Louisiana:</strong> Brent Cutrer (Louisiana Department of Agriculture and Forestry)
                </div>
                <div className="state-item">
                  <strong>Mississippi:</strong> Todd Matthews (Mississippi Forestry Commission)
                </div>
                <div className="state-item">
                  <strong>North Carolina:</strong> Rob Trickel (North Carolina Forest Service)
                </div>
                <div className="state-item">
                  <strong>South Carolina:</strong> David Jenkins (South Carolina Forestry Commission)
                </div>
                <div className="state-item">
                  <strong>Tennessee:</strong> Nathan Hoover (Tennessee Division of Forestry)
                </div>
                <div className="state-item">
                  <strong>Texas:</strong> Shane Harrington (Texas A&M Forest Service)
                </div>
                <div className="state-item">
                  <strong>Virginia:</strong> Lori Chamberlin (Virginia Department of Forestry)
                </div>
              </div>
            </div>

            <div className="collaboration-item">
              <h3>Technical Development</h3>
              <p>Web design and development by the Dartmouth Applied Learning and Innovation (DALI) Lab at Dartmouth College.</p>
              <div className="team-sections">
                <div className="team-section">
                  <h4>Current Team</h4>
                  <div className="member-list">
                    <div className="member-item">Thomas Monfre, Developer</div>
                    <div className="member-item">Jeff Liu, Developer</div>
                    <div className="member-item">Angela Zhang, Developer</div>
                    <div className="member-item">Hannah Utter, Team Manager</div>
                    <div className="member-item">Barkin Cavdaroglu, Designer</div>
                    <div className="member-item">Darley Sackitey, Designer and Animator</div>
                  </div>
                </div>
                <div className="team-section">
                  <h4>Previous Contributors</h4>
                  <div className="member-list">
                    <div className="member-item">Nathan Schneider, Developer</div>
                    <div className="member-item">John McCambridge, Developer</div>
                    <div className="member-item">Madeline Hess, Developer</div>
                    <div className="member-item">Isabel Hurley, Developer</div>
                    <div className="member-item">Anuj Varma, Team Manager</div>
                    <div className="member-item">Emma Langfitt, Designer and Developer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Funding</h2>
          <p>This project is supported by the National Science Foundation under Award ID 1917002.</p>
        </section>

        <section className="about-section contact-section">
          <h2>Contact Information</h2>
          <div className="contact-grid">
            <div className="contact-group">
              <h3>Research & Program Questions</h3>
              <div className="contact-item">
                <strong>Carissa Aoki</strong><br />
                <a href="mailto:caoki@mica.edu">caoki@mica.edu</a>
              </div>
              <div className="contact-item">
                <strong>Matthew Ayres</strong><br />
                <a href="mailto:matthew.p.ayres@dartmouth.edu">matthew.p.ayres@dartmouth.edu</a>
              </div>
            </div>

            <div className="contact-group">
              <h3>Local Forest Management</h3>
              <div className="contact-item">
                <strong>US Forest Service</strong><br />
                <a href="tel:8008321355">(800) 832-1355</a>
              </div>
            </div>

            <div className="contact-group">
              <h3>Technical Support</h3>
              <div className="contact-item">
                <strong>Dartmouth DALI Lab</strong><br />
                <a href="mailto:pine-beetle@dali.dartmouth.edu">pine-beetle@dali.dartmouth.edu</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
