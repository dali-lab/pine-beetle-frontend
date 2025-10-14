import React, { useEffect } from 'react';

import { CHART_MODES, DATA_MODES } from '../../constants';

import './style.scss';

import { OverviewText, TrappingDataMap } from '../trapping-data/components';

import { FilterBar, Loading, ScrollHint } from '../../components';

const HistoricalMapView = (props) => {
  const {
    dataMode,
    errorText,
    isLoading,
    setChartMode,
    setDataMode,
    clearAllSelections,
  } = props;

  useEffect(() => {
    clearAllSelections(); // clears selections initially when switching to this tab
    setChartMode(CHART_MODES.MAP); // ensure map view is shown
  }, [clearAllSelections, setChartMode]);

  return (
    <div className="historical-map-view-page">
      <div className="historical-map-view-container">
        <Loading visible={isLoading} />
        {errorText.length > 0 && errorText.map((t) => <p>{t}</p>)}
        <OverviewText title="Historical Map View" />
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
          </div>
        </div>
        <div className="container">
          <TrappingDataMap />
        </div>
        <ScrollHint />
      </div>
    </div>
  );
};

export default HistoricalMapView;
