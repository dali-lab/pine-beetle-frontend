import React from 'react';
import OverviewText from './components';
import ComparisonMap from './components/comparison-map';
import { Loading } from '../../components';
import SelectionBar from './components/selection-bar';

const ResultsComparison = (props) => {
  const { isLoading } = props;
  return (
    <div>
      <Loading visible={isLoading} />
      <OverviewText />
      <SelectionBar />
      <ComparisonMap />
    </div>
  );
};

export default ResultsComparison;
