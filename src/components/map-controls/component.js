import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import FilterOverlay from '../filter-overlay';
import LegendOverlay from '../legend-overlay';
import './style.scss';

// Constants
const DESKTOP_BREAKPOINT = 768;
const RESIZE_DEBOUNCE_MS = 150;

const MapControls = (props) => {
  const {
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
    legendItems,
    legendTitle = 'Outbreak Probability (%)',
    downloadCallback,
    isDownloadingMap,
    hideFilters = false,
  } = props;

  const [isDesktop, setIsDesktop] = useState(false);
  const [isPanelContentVisible, setIsPanelContentVisible] = useState(false);
  const [openSections, setOpenSections] = useState({
    filters: true,
    download: false,
    legend: true,
  });

  const filterOverlayProps = useMemo(() => ({
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
  }), [
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
  ]);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth > DESKTOP_BREAKPOINT);
    };

    checkIsDesktop();

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkIsDesktop, RESIZE_DEBOUNCE_MS);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  useEffect(() => {
    setOpenSections({
      filters: true,
      legend: true,
      download: false,
    });
    setIsPanelContentVisible(isDesktop);
  }, [isDesktop]);

  const handleDownloadClick = useCallback(() => {
    if (!downloadCallback) {
      console.warn('MapControls: downloadCallback is not provided');
      return;
    }

    setOpenSections((prev) => ({
      ...prev,
      filters: false,
      legend: false,
    }));
    downloadCallback();
  }, [downloadCallback]);

  const handleCloseFilters = useCallback(() => {
    setOpenSections((prev) => ({
      ...prev,
      filters: false,
    }));
  }, []);

  const handleCloseLegend = useCallback(() => {
    setOpenSections((prev) => ({
      ...prev,
      legend: false,
    }));
  }, []);

  const togglePanelContentVisibility = useCallback(() => {
    setIsPanelContentVisible((prev) => !prev);
  }, []);

  const toggleSection = useCallback((section) => {
    setOpenSections((prev) => {
      if (prev[section]) {
        return {
          ...prev,
          [section]: false,
        };
      }
      return {
        filters: false,
        download: false,
        legend: false,
        [section]: true,
      };
    });
  }, []);

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
              aria-expanded={isPanelContentVisible}
              aria-controls="map-controls-content"
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
          <div id="map-controls-content">
            {/* Filters Section - Only show if not hidden */}
            {!hideFilters && (
              <div className="control-section">
                <button
                  type="button"
                  className={`section-header ${openSections.filters ? 'active' : ''}`}
                  onClick={() => toggleSection('filters')}
                  aria-expanded={openSections.filters}
                  aria-controls="filters-content"
                >
                  <span className="section-title">Filters</span>
                  <span className="section-toggle">
                    {openSections.filters ? '−' : '+'}
                  </span>
                </button>
                {openSections.filters && (
                  <div id="filters-content">
                    <FilterOverlay
                      availableStates={filterOverlayProps.availableStates}
                      availableYears={filterOverlayProps.availableYears}
                      availableSublocations={filterOverlayProps.availableSublocations}
                      county={filterOverlayProps.county}
                      dataMode={filterOverlayProps.dataMode}
                      predictionYear={filterOverlayProps.predictionYear}
                      rangerDistrict={filterOverlayProps.rangerDistrict}
                      selectedState={filterOverlayProps.selectedState}
                      setCounty={filterOverlayProps.setCounty}
                      setPredictionYear={filterOverlayProps.setPredictionYear}
                      setRangerDistrict={filterOverlayProps.setRangerDistrict}
                      setState={filterOverlayProps.setState}
                      clearAllSelections={filterOverlayProps.clearAllSelections}
                      className="embedded-control"
                      onClose={handleCloseFilters}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Legend Section */}
            <div className="control-section">
              <button
                type="button"
                className={`section-header ${openSections.legend ? 'active' : ''}`}
                onClick={() => toggleSection('legend')}
                aria-expanded={openSections.legend}
                aria-controls="legend-content"
              >
                <span className="section-title">Legend</span>
                <span className="section-toggle">
                  {openSections.legend ? '−' : '+'}
                </span>
              </button>
              {openSections.legend && (
                <div id="legend-content">
                  <LegendOverlay
                    legendItems={legendItems}
                    title={legendTitle}
                    className="embedded-control"
                  />
                </div>
              )}
            </div>

            {/* Download Section */}
            <div className="control-section">
              <button
                type="button"
                className="section-header download-direct"
                onClick={handleDownloadClick}
                disabled={isDownloadingMap}
                aria-label={isDownloadingMap ? 'Downloading map' : 'Download map'}
              >
                <span className="section-title">{isDownloadingMap ? 'Downloading...' : 'Download map'}</span>
              </button>
            </div>
          </div>
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
          aria-expanded={openSections.filters}
          aria-label="Toggle filters"
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
          aria-expanded={openSections.legend}
          aria-label="Toggle legend"
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
          aria-label={isDownloadingMap ? 'Downloading map' : 'Download map'}
        >
          <div className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="nav-label">{isDownloadingMap ? 'Downloading...' : 'Download'}</span>
        </button>
      </div>

      {!isDesktop && openSections.filters && !hideFilters && (
        <FilterOverlay
          availableStates={filterOverlayProps.availableStates}
          availableYears={filterOverlayProps.availableYears}
          availableSublocations={filterOverlayProps.availableSublocations}
          county={filterOverlayProps.county}
          dataMode={filterOverlayProps.dataMode}
          predictionYear={filterOverlayProps.predictionYear}
          rangerDistrict={filterOverlayProps.rangerDistrict}
          selectedState={filterOverlayProps.selectedState}
          setCounty={filterOverlayProps.setCounty}
          setPredictionYear={filterOverlayProps.setPredictionYear}
          setRangerDistrict={filterOverlayProps.setRangerDistrict}
          setState={filterOverlayProps.setState}
          clearAllSelections={filterOverlayProps.clearAllSelections}
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
