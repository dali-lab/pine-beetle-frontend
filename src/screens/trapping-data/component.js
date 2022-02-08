import React from 'react';

import { CHART_MODES, DATA_MODES } from '../../constants';

import './style.scss';

import {
  TrappingDataMap,
  LineChart,
  OverviewText,
  SelectionBar,
} from './components';

import { Loading } from '../../components';

const mapSelectedIcon = require('../../assets/icons/map-selected.png');
const mapUnselectedIcon = require('../../assets/icons/map-unselected.png');
const graphSelectedIcon = require('../../assets/icons/graph-selected.png');
const graphUnselectedIcon = require('../../assets/icons/graph-unselected.png');

const TrappingData = (props) => {
  const {
    chartMode,
    dataMode,
    errorText,
    isLoading,
    setChartMode,
    setDataMode,
  } = props;

  const isGraphView = chartMode === CHART_MODES.GRAPH;
  const setGraphView = () => setChartMode(CHART_MODES.GRAPH);
  const setMapView = () => setChartMode(CHART_MODES.MAP);

  return (
    <div>
      <Loading visible={isLoading} />
      {errorText.length > 0 && errorText.map(t => <p>{t}</p>)}
      <OverviewText />
      <SelectionBar />
      <div id="view-selections" className="container">
        <div className="selection">
          <div
            className={dataMode === DATA_MODES.COUNTY ? 'selected-option' : 'unselected-option'}
            onClick={() => { setDataMode(DATA_MODES.COUNTY); }}
          >
            <p className={dataMode === DATA_MODES.COUNTY ? 'selected-option-text' : 'unselected-option-text'}>
              Counties
            </p>
          </div>
          <div
            className={dataMode !== DATA_MODES.COUNTY ? 'selected-option' : 'unselected-option'}
            onClick={() => { setDataMode(DATA_MODES.RANGER_DISTRICT); }}
          >
            <p className={dataMode !== DATA_MODES.COUNTY ? 'selected-option-text' : 'unselected-option-text'}>
              Federal Land
            </p>
          </div>
        </div>
        <div className="selection">
          <div
            className={isGraphView ? 'selected-option-2' : 'unselected-option'}
            onClick={setGraphView}
          >
            <img
              src={isGraphView ? graphSelectedIcon : graphUnselectedIcon}
              alt="Chart View"
              className={isGraphView ? 'selected-view' : 'unselected-view'}
            />
            <p className={isGraphView ? 'selected-option-text' : 'unselected-option-text'}>
              Graph View
            </p>
          </div>
          <div
            className={isGraphView ? 'unselected-option' : 'selected-option-2'}
            onClick={setMapView}
          >
            <img
              src={isGraphView ? mapUnselectedIcon : mapSelectedIcon}
              alt="Map View"
              className={isGraphView ? 'unselected-view' : 'selected-view'}
            />
            <p className={isGraphView ? 'unselected-option-text' : 'selected-option-text'}>
              Map View
            </p>
          </div>
        </div>
      </div>
      <div className="container">
        {isGraphView ? <LineChart /> : <TrappingDataMap />}
      </div>
    </div>
  );
};

export default TrappingData;
