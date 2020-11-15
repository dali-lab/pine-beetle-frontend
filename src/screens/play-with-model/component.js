import React from 'react';

import {
  PlayWithModelInputs,
  OverviewText,
  SelectionBar,
} from './components';

const PlayWithModel = (props) => {
  return (
    <div>
      <OverviewText />
      <SelectionBar />
      <PlayWithModelInputs />
    </div>
  );
};

export default PlayWithModel;
