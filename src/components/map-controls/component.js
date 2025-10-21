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
      {/* Unified Controls Panel */}
      <div className="unified-controls-panel">
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
      </div>
    </div>
  );
};

export default MapControls;
