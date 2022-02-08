/* eslint-disable react/button-has-type */
import React from 'react';

import { ChoiceInput } from '../../../../components/input-components';
import { CHART_MODES } from '../../../../constants';

// import { DATA_MODES } from '../../../../constants';

import {
  getStateNameFromAbbreviation,
  getStateAbbreviationFromStateName,
} from '../../../../utils';

import './style.scss';

const mapSelectedIcon = require('../../../../assets/icons/map-selected.png');
const mapUnselectedIcon = require('../../../../assets/icons/map-unselected.png');
const graphSelectedIcon = require('../../../../assets/icons/graph-selected.png');
const graphUnselectedIcon = require('../../../../assets/icons/graph-unselected.png');

const SelectionBar = (props) => {
  const {
    availableStates,
    availableYears,
    clearAllSelections,
    chartMode,
    setChartMode,
    selectedState,
    setPredictionYear,
    setState,
    year,
  } = props;

  const statesMappedToNames = availableStates.map(abbrev => getStateNameFromAbbreviation(abbrev)).filter(s => !!s);
  const selectedStateName = getStateNameFromAbbreviation(selectedState);
  const setStateAbbrev = stateName => setState(getStateAbbreviationFromStateName(stateName));

  const isGraphView = chartMode === CHART_MODES.GRAPH;
  const setGraphView = () => setChartMode(CHART_MODES.GRAPH);
  const setMapView = () => setChartMode(CHART_MODES.MAP);

  // const countyMode = dataMode === DATA_MODES.COUNTY;

  return (
    <div>
      <div id="predictionbar" className="container">
        <ChoiceInput instructions="Year" setValue={setPredictionYear} options={availableYears} value={year} />
        <div id="vl1" />
        <ChoiceInput instructions="State" value={selectedStateName} setValue={setStateAbbrev} options={statesMappedToNames} firstOptionText="State" />
        <div id="vl1" />
        <button id="reset-current-data-button" className="animated-button" onClick={clearAllSelections}>Clear</button>
      </div>

      <div className="selection-p">
        <div
          className={isGraphView ? 'selected-option-2-p' : 'unselected-option-p'}
          onClick={setGraphView}
        >
          <img
            src={isGraphView ? graphSelectedIcon : graphUnselectedIcon}
            alt="Chart View"
            className={isGraphView ? 'selected-view-p' : 'unselected-view-p'}
          />
          <p className={isGraphView ? 'selected-option-text-p' : 'unselected-option-text-p'}>
            Graph View
          </p>
        </div>
        <div
          className={isGraphView ? 'unselected-option-p' : 'selected-option-2-p'}
          onClick={setMapView}
        >
          <img
            src={isGraphView ? mapUnselectedIcon : mapSelectedIcon}
            alt="Map View"
            className={isGraphView ? 'unselected-view-p' : 'selected-view-p'}
          />
          <p className={isGraphView ? 'unselected-option-text-p' : 'selected-option-text-p'}>
            Map View
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectionBar;
