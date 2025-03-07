import React from 'react';

import './style.scss';

const explanatoryText = `This map compares the observed number of spots with the predicted outcome. 
Because our model offers a probabilistic prediction, rather than a yes or no outcome, we had to choose a threshold 
for which the percent probability and the number of spots would mean "outbreak predicted." 
The legend on this map is keyed to a 20% threshold, and a probability of >20 spots. 
So "outbreak predicted" means there was a 20% or greater chance of there being 20 or more spots in any given location. 
"Outbreak not predicted" means there was a less than 20 % chance of there being 20 or more spots. 
Although it is common for "20%" to be viewed as a low number for "probability that an event occurs," 
it still means a 1 in 5 chance, which we think qualifies as a prediction of outbreak.`;

const OverviewText = (_props) => (
  <div className="container" id="overview-explanation">
    <div className="container" id="overview-text">
      <h1 id="title">
        How did we do?
      </h1>
    </div>
    <div>
      <p>
        {explanatoryText}
      </p>
    </div>
  </div>

);

export default OverviewText;
