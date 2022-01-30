import React from 'react';

import { CHART_MODES, DATA_MODES } from '../../constants';

import './style.scss';

import {
  TrappingDataMap,
  LineChart,
  OverviewText,
  SelectionBar,
} from './components';

import { DownloadData, Loading } from '../../components';

const mapSelectedIcon = require('../../assets/icons/map-selected.png');
const mapUnselectedIcon = require('../../assets/icons/map-unselected.png');
const graphSelectedIcon = require('../../assets/icons/graph-selected.png');
const graphUnselectedIcon = require('../../assets/icons/graph-unselected.png');

const TrappingData = (props) => {
  const {
    chartMode,
    setChartMode,
    setDataMode,
    dataMode,
    isLoading,
    trappingData,
    trappingErrorText,
  } = props;

  const isGraphView = chartMode === CHART_MODES.GRAPH;
  const setGraphView = () => setChartMode(CHART_MODES.GRAPH);
  const setMapView = () => setChartMode(CHART_MODES.MAP);

  return (
    <div>
      <Loading visible={isLoading} />
      {trappingErrorText.length > 0 && trappingErrorText.map(t => <p>{t}</p>)}
      <OverviewText />
      <SelectionBar />
      <div id="view-selections" className="container">
        <div id="selection-location">
          <div
            id={dataMode === DATA_MODES.COUNTY ? 'selected-location' : 'unselected-location'}
            onClick={() => { setDataMode(DATA_MODES.COUNTY); }}
          >
            <p id={dataMode === DATA_MODES.COUNTY ? 'selected-location-text' : 'unselected-location-text'}>
              Counties
            </p>
          </div>
          <div
            id={dataMode !== DATA_MODES.COUNTY ? 'selected-location' : 'unselected-location'}
            onClick={() => { setDataMode(DATA_MODES.RANGER_DISTRICT); }}
          >
            <p id={dataMode !== DATA_MODES.COUNTY ? 'selected-location-text' : 'unselected-location-text'}>
              Federal Land
            </p>
          </div>
        </div>
        <div id="selection" onClick={setGraphView}>
          <img
            src={isGraphView ? graphSelectedIcon : graphUnselectedIcon}
            alt="Chart View"
            id={isGraphView ? 'selected-view' : null}
          />
          <p id={isGraphView ? 'selected-view' : null} className="view-selection-btn">
            Graph View
          </p>
        </div>
        <div id="selection" onClick={setMapView}>
          <img
            src={isGraphView ? mapUnselectedIcon : mapSelectedIcon}
            alt="Map View"
            id={isGraphView ? null : 'selected-view'}
          />
          <p id={isGraphView ? null : 'selected-view'} className="view-selection-btn">
            Map View
          </p>
        </div>
      </div>
      <div className="container">
        {isGraphView ? <LineChart data={trappingData} /> : <TrappingDataMap />}
      </div>
      <DownloadData />
    </div>
  );
};

export default TrappingData;
