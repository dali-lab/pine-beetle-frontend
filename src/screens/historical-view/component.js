import React, { useEffect } from 'react';

import { CHART_MODES, DATA_MODES } from '../../constants';

import './style.scss';

import { LineChart, OverviewText, TrappingDataMap } from '../trapping-data/components';

import { FilterBar, Loader } from '../../components';

import graphSelectedIcon from '../../assets/icons/graph-selected.png';
import graphUnselectedIcon from '../../assets/icons/graph-unselected.png';
import mapSelectedIcon from '../../assets/icons/map-selected.png';
import mapUnselectedIcon from '../../assets/icons/map-unselected.png';

const HistoricalView = (props) => {
  const {
    chartMode,
    dataMode,
    errorText,
    isLoading,
    setChartMode,
    setDataMode,
    clearAllSelections,
    setStartYear,
    availableYears,
  } = props;

  const isGraphView = chartMode === CHART_MODES.GRAPH;
  const setMapView = () => setChartMode(CHART_MODES.MAP);

  useEffect(() => {
    clearAllSelections(); // clears selections initially when switching to this tab
    setChartMode(CHART_MODES.GRAPH); // ensure graph view is shown by default
  }, [clearAllSelections, setChartMode]);

  // TODO handle other way here as well
  const handleChangeToGraphView = () => {
    setChartMode(CHART_MODES.GRAPH);
    if (setStartYear && availableYears && availableYears.length > 0) {
      setStartYear(availableYears[0]);
    }
  };

  return (
    <div className="historical-view-page">
      <div className="historical-view-container">
        <Loader visible={isLoading} />
        {errorText.length > 0 && errorText.map((t) => <p>{t}</p>)}
        <OverviewText title="Historical Data" />
        <div className="container">
          <FilterBar useHistoricalData title="Filter Historical Data" />
        </div>
        <div id="view-selections" className="container">
          <div id="toggles-overlay-h">
            <div className="selection">
              <div
                className={dataMode === DATA_MODES.COUNTY ? 'selected-option' : 'unselected-option'}
                onClick={() => setDataMode(DATA_MODES.COUNTY)}
              >
                <p className={dataMode === DATA_MODES.COUNTY ? 'selected-option-text' : 'unselected-option-text'}>
                  Counties
                </p>
              </div>
              <div
                className={dataMode !== DATA_MODES.COUNTY ? 'selected-option' : 'unselected-option'}
                onClick={() => setDataMode(DATA_MODES.RANGER_DISTRICT)}
              >
                <p className={dataMode !== DATA_MODES.COUNTY ? 'selected-option-text' : 'unselected-option-text'}>
                  Federal Land
                </p>
              </div>
            </div>
            <div className="selection">
              <div
                className={isGraphView ? 'selected-option-2' : 'unselected-option'}
                onClick={handleChangeToGraphView}
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
        </div>
        <div className="container">
          {isGraphView ? <LineChart /> : <TrappingDataMap />}
        </div>
      </div>
    </div>
  );
};

export default HistoricalView;
