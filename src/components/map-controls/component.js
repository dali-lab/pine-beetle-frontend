import React, { useState } from 'react';
import FilterOverlay from '../filter-overlay';
import LegendOverlay from '../legend-overlay';
import './style.scss';

const MapControls = (props) => {
  const {
    // Filter props
    availableStates,
    availableYears,
    availableSublocations,
    county,
    dataMode,
    predictionYear,
    rangerDistrict,
    selectedState,
    setCounty,
    setPredictionYear,
    setRangerDistrict,
    setState,
    clearAllSelections,
    // Legend props
    legendItems,
    legendTitle = 'Outbreak Probability (%)',
    // Download props
    downloadCallback,
    isDownloadingMap,
  } = props;

  const [showPanel, setShowPanel] = useState(true); // Panel open by default
  const [openSections, setOpenSections] = useState({
    filters: true, // Only filters open by default
    download: false,
    legend: false,
  });

  const handleDownloadClick = () => {
    downloadCallback();
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="map-controls-panel">
      {/* Toggle Button */}
      <button
        type="button"
        className={`panel-toggle-button ${showPanel ? 'panel-open' : 'panel-closed'}`}
        onClick={() => setShowPanel(!showPanel)}
      >
        Controls
        <span className="toggle-icon">{showPanel ? '−' : '+'}</span>
      </button>

      {/* Unified Controls Panel */}
      {showPanel && (
        <div className="unified-controls-panel">
          {/* Filters Section */}
          <div className="control-section">
            <button
              type="button"
              className={`section-header ${openSections.filters ? 'active' : ''}`}
              onClick={() => toggleSection('filters')}
            >
              <span className="section-title">Filters</span>
              <span className="section-toggle">
                {openSections.filters ? '−' : '+'}
              </span>
            </button>
            {openSections.filters && (
              <FilterOverlay
                availableStates={availableStates}
                availableYears={availableYears}
                availableSublocations={availableSublocations}
                county={county}
                dataMode={dataMode}
                predictionYear={predictionYear}
                rangerDistrict={rangerDistrict}
                selectedState={selectedState}
                setCounty={setCounty}
                setPredictionYear={setPredictionYear}
                setRangerDistrict={setRangerDistrict}
                setState={setState}
                clearAllSelections={clearAllSelections}
                className="embedded-control"
              />
            )}
          </div>

          {/* Legend Section */}
          <div className="control-section">
            <button
              type="button"
              className={`section-header ${openSections.legend ? 'active' : ''}`}
              onClick={() => toggleSection('legend')}
            >
              <span className="section-title">Legend</span>
              <span className="section-toggle">
                {openSections.legend ? '−' : '+'}
              </span>
            </button>
            {openSections.legend && (
              <LegendOverlay
                legendItems={legendItems}
                title={legendTitle}
                className="embedded-control"
              />
            )}
          </div>

          {/* Download Section */}
          <div className="control-section">
            <button
              type="button"
              className="section-header"
              onClick={() => handleDownloadClick()}
            >
              <span className="section-title">{isDownloadingMap ? 'Downloading...' : 'Download map'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapControls;
