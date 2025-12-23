import React, { useEffect } from 'react';
import { FilterBar, Loader } from '../../components';
import {
  ComparisonMap, OverviewText, ScatterChart, ScatterChartSelectionBar,
} from './components';

import './style.scss';

const ObservedOutcomes = (props) => {
  const {
    isLoading, predictionYear, dataMode, fetchData, yearsLoaded, fetchAvailableYears,
  } = props;

  // Fetch available years on mount
  useEffect(() => {
    fetchAvailableYears();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch data when year or dataMode changes
  useEffect(() => {
    if (yearsLoaded && predictionYear) {
      fetchData(predictionYear);
    }
  }, [predictionYear, dataMode, fetchData, yearsLoaded]);

  return (
    <div className="observed-outcomes-page">
      <div className="observed-outcomes-container">
        <Loader visible={isLoading} />
        <OverviewText />
        <div className="observed-outcomes-content">
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

export default ObservedOutcomes;
