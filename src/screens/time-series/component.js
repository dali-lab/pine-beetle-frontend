import React, { useEffect } from 'react';

import { CHART_MODES, DATA_MODES } from '../../constants';

import './style.scss';

import { LineChart, TrappingDataMap } from '../../components/historical-data';

import { FilterBar, Loader } from '../../components';

import graphSelectedIcon from '../../assets/icons/graph-selected.png';
import graphUnselectedIcon from '../../assets/icons/graph-unselected.png';
import mapSelectedIcon from '../../assets/icons/map-selected.png';
import mapUnselectedIcon from '../../assets/icons/map-unselected.png';

const TimeSeries = (props) => {
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

  // Deduplicate error messages to avoid duplicate keys
  const uniqueErrors = Array.from(new Set(errorText));

  return (
    <div className="time-series-page">
      <div className="time-series-container">
        <Loader visible={isLoading} />
        {uniqueErrors.length > 0 && uniqueErrors.map((t) => <p key={t}>{t}</p>)}
        <div className="page-header">
          <h1>Historical Data</h1>
          <p className="page-description">
            Southern pine beetle trapping data have been collected across the southeast since 1988.
            All historical data are collected here in one place for researchers, forest resource managers, and the general public to access.
            Using the filter below, you can explore totals for different locations across your chosen length of time.
          </p>
        </div>
        <div className="time-series-content">
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
    </div>
  );
};

export default TimeSeries;
