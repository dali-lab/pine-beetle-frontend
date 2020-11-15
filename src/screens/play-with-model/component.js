import React from 'react';

import {
  PlayWithModelInputs,
  OverviewText,
  SelectionBar,
} from './components';

const PlayWithModel = (props) => {
  // const {
  //   clearError, // function to clear the error
  //   customPrediction, // result of prediction output
  //   error, // error object if one occurred
  //   isError, // whether or not an error occurred
  //   isLoading, // whether or not we are loading (i.e. running the model)
  //   runCustomPrediction, // function to call for running the prediction
  // } = props;

  return (
    <div>
      <OverviewText />
      <SelectionBar />
      <PlayWithModelInputs />
    </div>
  );
};

export default PlayWithModel;
