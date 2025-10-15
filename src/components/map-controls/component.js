import React, { useEffect, useState } from 'react';
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
  const [isDesktop, setIsDesktop] = useState(false);
  const [openSections, setOpenSections] = useState({
    filters: false, // Will be set based on device type
    download: false,
    legend: false,
  });

  // Detect if device is desktop (screen width > 768px)
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    // Check on mount
    checkIsDesktop();

    // Listen for resize events
    window.addEventListener('resize', checkIsDesktop);

    return () => {
      window.removeEventListener('resize', checkIsDesktop);
    };
  }, []);

  // Set default filter state based on device type
  useEffect(() => {
    setOpenSections((prev) => ({
      ...prev,
      filters: isDesktop, // Open filters by default on desktop
    }));
  }, [isDesktop]);

  const handleDownloadClick = () => {
    downloadCallback();
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => {
      // If clicking the same section, toggle it
      if (prev[section]) {
        return {
          ...prev,
          [section]: false,
        };
      }
      // If clicking a different section, close all others and open this one
      return {
        filters: false,
        download: false,
        legend: false,
        [section]: true,
      };
    });
  };

  return (
    <div className="map-controls-panel">
      {/* Toggle Button - Hidden on mobile */}
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
              className={`section-header ${openSections.download ? 'active' : ''}`}
              onClick={() => toggleSection('download')}
            >
              <span className="section-title">{isDownloadingMap ? 'Downloading...' : 'Download map'}</span>
            </button>
            {openSections.download && (
              <div className="download-control">
                <button
                  type="button"
                  className="action-button"
                  onClick={() => {
                    handleDownloadClick();
                    setOpenSections((prev) => ({ ...prev, download: false }));
                  }}
                  disabled={isDownloadingMap}
                >
                  {isDownloadingMap ? 'Downloading...' : 'Download Map'}
                </button>
                <p className="download-help">
                  Download the current map view as a high-resolution image
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapControls;
