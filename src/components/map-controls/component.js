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
    // Control visibility
    hideFilters = false,
  } = props;

  const [isDesktop, setIsDesktop] = useState(false);
  const [isPanelContentVisible, setIsPanelContentVisible] = useState(true); // Controls panel content visibility
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
      filters: isDesktop, // Open filters by default on desktop only
      legend: false, // Always closed by default
      download: false, // Always closed by default
    }));
    // Show panel content by default on desktop
    setIsPanelContentVisible(isDesktop);
  }, [isDesktop]);

  const handleDownloadClick = () => {
    // Close filters and legend when downloading
    setOpenSections((prev) => ({
      ...prev,
      filters: false,
      legend: false,
    }));
    downloadCallback();
  };

  const handleCloseFilters = () => {
    setOpenSections((prev) => ({
      ...prev,
      filters: false,
    }));
  };

  const handleCloseLegend = () => {
    setOpenSections((prev) => ({
      ...prev,
      legend: false,
    }));
  };

  const togglePanelContentVisibility = () => {
    setIsPanelContentVisible((prev) => !prev);
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
      // If clicking filters or legend, allow them to coexist
      // Only close download section when opening filters or legend
      if (section === 'filters' || section === 'legend') {
        return {
          ...prev,
          download: false,
          [section]: true,
        };
      }
      // For download section, close all others
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
      {/* Desktop Controls Panel */}
      <div className={`unified-controls-panel desktop-controls ${!isPanelContentVisible ? 'collapsed' : ''}`}>
        {/* Controls Toggle Section - Desktop Only */}
        {isDesktop && (
          <div className="control-section">
            <button
              type="button"
              className={`section-header controls-header ${isPanelContentVisible ? 'active' : ''}`}
              onClick={togglePanelContentVisibility}
              aria-label={isPanelContentVisible ? 'Hide controls' : 'Show controls'}
            >
              <span className="section-title">Controls</span>
              <span className="section-toggle">
                {isPanelContentVisible ? '−' : '+'}
              </span>
            </button>
          </div>
        )}

        {/* Panel Content - Only show when panel content is visible */}
        {isPanelContentVisible && (
          <>
            {/* Filters Section - Only show if not hidden */}
            {!hideFilters && (
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
                    onClose={handleCloseFilters}
                  />
                )}
              </div>
            )}

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
                className="section-header download-direct"
                onClick={handleDownloadClick}
                disabled={isDownloadingMap}
              >
                <span className="section-title">{isDownloadingMap ? 'Downloading...' : 'Download map'}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        {/* Filters Button - Only show if not hidden */}
        {!hideFilters && (
        <button
          type="button"
          className={`nav-button ${openSections.filters ? 'active' : ''}`}
          onClick={() => toggleSection('filters')}
        >
          <div className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 4h18M3 8h12M3 12h8M3 16h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="nav-label">Filters</span>
        </button>
        )}

        {/* Legend Button */}
        <button
          type="button"
          className={`nav-button ${openSections.legend ? 'active' : ''}`}
          onClick={() => toggleSection('legend')}
        >
          <div className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="nav-label">Legend</span>
        </button>

        {/* Download Button */}
        <button
          type="button"
          className="nav-button"
          onClick={handleDownloadClick}
          disabled={isDownloadingMap}
        >
          <div className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="nav-label">{isDownloadingMap ? 'Downloading...' : 'Download'}</span>
        </button>
      </div>

      {/* Mobile Full-Screen Overlays */}
      {!isDesktop && openSections.filters && !hideFilters && (
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
          className="filter-mobile-fullscreen-overlay"
          onClose={handleCloseFilters}
        />
      )}

      {!isDesktop && openSections.legend && (
        <LegendOverlay
          legendItems={legendItems}
          title={legendTitle}
          className="legend-mobile-fullscreen-overlay"
          onClose={handleCloseLegend}
        />
      )}
    </div>
  );
};

export default MapControls;
