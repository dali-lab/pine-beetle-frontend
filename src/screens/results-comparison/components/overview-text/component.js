import React from 'react';

const OverviewText = (_props) => (
  <div className="page-header">
    <h1>How did we do?</h1>
    <div className="overview-text-container">
      <p className="page-description">
        This map compares the observed number of spots with the predicted outcome.
        Because our model offers a probabilistic prediction, rather than a yes or no outcome, we had to choose a threshold
        for which the percent probability and the number of spots would mean &quot;outbreak predicted.&quot;
      </p>

      <br />

      <p className="page-description">
        The legend on this map is keyed to a 20% threshold, and a probability of &gt;50 spots.
        So &quot;outbreak predicted&quot; means there was a 20% or greater chance of there being 20 or more spots in any given location.
        &quot;Outbreak not predicted&quot; means there was a less than 20% chance of there being 20 or more spots.
        Although it is common for &quot;20%&quot; to be viewed as a low number for &quot;probability that an event occurs,&quot;
        it still means a 1 in 5 chance, which we think qualifies as a prediction of outbreak.
      </p>
    </div>
  </div>
);

export default OverviewText;
