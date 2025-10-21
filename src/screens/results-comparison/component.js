import React from 'react';
import { FilterBar, Loading } from '../../components';
import {
  ComparisonMap, OverviewText, ScatterChart, ScatterChartSelectionBar,
} from './components';

import './style.scss';

const ResultsComparison = (props) => {
  const { isLoading } = props;
  return (
    <div className="results-comparison-page">
      <div className="results-comparison-container">
        <Loading visible={isLoading} />
        <OverviewText />
        <div className="container">
          <FilterBar />
        </div>
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
      </div>
    </div>
  );
};

export default ResultsComparison;
