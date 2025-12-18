import React, { useEffect } from 'react';
import { FilterBar, Loader } from '../../components';
import {
  ComparisonMap, OverviewText, ScatterChart, ScatterChartSelectionBar,
} from './components';

import './style.scss';

const ResultsComparison = (props) => {
  const {
    isLoading, predictionYear, hasData, fetchData, yearsLoaded, fetchAvailableYears,
  } = props;

  // Fetch available years on mount
  useEffect(() => {
    fetchAvailableYears();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch data once years are loaded and we have a valid year
  useEffect(() => {
    if (!hasData && yearsLoaded && predictionYear) {
      fetchData(predictionYear);
    }
  }, [hasData, predictionYear, fetchData, yearsLoaded]);

  return (
    <div className="results-comparison-page">
      <div className="results-comparison-container">
        <Loader visible={isLoading} />
        <OverviewText />
        <div className="results-comparison-content">
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
    </div>
  );
};

export default ResultsComparison;
