import React from 'react';
import {
  ComparisonMap, OverviewText, ScatterChart, ScatterChartSelectionBar, SelectionBar,
} from './components';
import { Loading, ScrollHint } from '../../components';

const ResultsComparison = (props) => {
  const { isLoading } = props;
  return (
    <div>
      <Loading visible={isLoading} />
      <OverviewText />
      <SelectionBar />
      <ComparisonMap />
      <div className="container">
        <h2 className="prediction-chart-title">Predictions versus outcomes</h2>
        <p className="prediction-chart-text">Each point represents one county or ranger district in one year.
          The regression line indicates the overall relationship between predictions and outcomes.
          Points above the line had more SPB spots than predicted. Points below the line had fewer spots than predicted.
          Highlighted points are for the indicated year.
        </p>
      </div>
      <ScatterChartSelectionBar />
      <ScatterChart />
      <ScrollHint />
    </div>
  );
};

export default ResultsComparison;
