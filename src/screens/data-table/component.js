import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Loader } from '../../components';
import { ChoiceInput, MultiSelectInput } from '../../components/input-components';
import { DATA_MODES, stateAbbrevToStateName } from '../../constants';
import {
  getStateAbbreviationFromStateName,
  getStateNameFromAbbreviation,
} from '../../utils';

import './style.scss';

const ITEMS_PER_PAGE = 100;

const DataTableScreen = ({
  sparseData,
  sublocationData,
  isLoading,
  errorText,
  dataMode,
  startYear: reduxStartYear,
  endYear: reduxEndYear,
  selectedState: reduxSelectedState,
  county: reduxCounty,
  rangerDistrict: reduxRangerDistrict,
  availableHistoricalYears,
  availableHistoricalStates,
  availableHistoricalSublocations,
  getUnsummarizedData,
  getAggregateLocationData,
  getAvailableStates,
  getAvailableYears,
  setStartYear,
  setEndYear,
  setState,
  setCounty,
  setRangerDistrict,
  setDataMode,
}) => {
  const [sortField, setSortField] = useState('year');
  const [sortDirection, setSortDirection] = useState('asc');
  const [dataFormat, setDataFormat] = useState('raw');
  const [showEmptyRecords, setShowEmptyRecords] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Build filters object
  const filters = useMemo(
    () => ({
      startYear: reduxStartYear || undefined,
      endYear: reduxEndYear || undefined,
      state: reduxSelectedState || undefined,
      county: reduxCounty && reduxCounty.length > 0 ? reduxCounty : undefined,
      rangerDistrict: reduxRangerDistrict && reduxRangerDistrict.length > 0 ? reduxRangerDistrict : undefined,
    }),
    [reduxStartYear, reduxEndYear, reduxSelectedState, reduxCounty, reduxRangerDistrict],
  );

  // Extract week number from various field formats
  const extractWeekNumber = useCallback((item) => {
    if (item.weekNumber !== undefined && item.weekNumber !== null) {
      return item.weekNumber;
    }

    if (item.season) {
      const seasonMatch = String(item.season).match(/(\d+)/);
      if (seasonMatch) {
        const weekNum = Number.parseInt(seasonMatch[1], 10);
        if (weekNum >= 1 && weekNum <= 6) {
          return weekNum;
        }
      }
    }

    if (item.collectionDate && item.startDate) {
      try {
        const date = new Date(item.collectionDate);
        const startDate = new Date(item.startDate);
        if (!Number.isNaN(date.getTime()) && !Number.isNaN(startDate.getTime())) {
          const diffTime = date.getTime() - startDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const weekNum = Math.floor(diffDays / 14) + 1;
          if (weekNum >= 1 && weekNum <= 6) {
            return weekNum;
          }
        }
      } catch (e) {
        // Ignore date parsing errors
      }
    }

    return null;
  }, []);

  // Normalize weekly data (expand week1-week6 fields into separate records)
  const normalizeWeeklyData = useCallback((rawData) => {
    if (!rawData || !Array.isArray(rawData)) {
      return [];
    }

    const normalized = [];

    rawData.forEach((item) => {
      const weekFields = Object.keys(item).filter((key) => /^week\d+$/i.test(key));

      if (weekFields.length > 0) {
        weekFields.forEach((weekField) => {
          const weekNumber = Number.parseInt(weekField.replace(/week/i, ''), 10);
          const spbCount = item[weekField];

          if (spbCount !== null && spbCount !== undefined && spbCount > 0) {
            normalized.push({
              ...item,
              weekNumber,
              spbCount,
            });
          }
        });
      } else {
        const weekNumber = extractWeekNumber(item);
        normalized.push({
          ...item,
          weekNumber: weekNumber !== null ? weekNumber : null,
        });
      }
    });

    return normalized;
  }, [extractWeekNumber]);

  // Transform raw (unsummarized) data
  const transformRawData = useCallback((rawData) => {
    if (!rawData || !Array.isArray(rawData)) {
      return [];
    }

    const normalizedData = normalizeWeeklyData(rawData);
    if (normalizedData.length === 0) return [];

    return normalizedData.map((item, index) => {
      const stateName = stateAbbrevToStateName[item.state] || item.state;
      const locationName = dataMode === DATA_MODES.COUNTY ? item.county : item.rangerDistrict;

      return {
        id: `raw-${index}`,
        year: item.year || null,
        state: stateName || 'N/A',
        county: locationName || 'N/A',
        trap: item.trap || 'N/A',
        weekNumber: item.weekNumber !== undefined && item.weekNumber !== null ? item.weekNumber : null,
        spbCount: item.spbCount !== undefined && item.spbCount !== null ? item.spbCount : 0,
        cleridCount: item.cleridCount !== undefined && item.cleridCount !== null ? item.cleridCount : 0,
        collectionDate: item.collectionDate || null,
        daysActive: item.daysActive || 0,
        latitude: item.latitude || null,
        longitude: item.longitude || null,
        lure: item.lure || null,
        endobrev: item.endobrev || null,
        season: item.season || null,
      };
    });
  }, [dataMode, normalizeWeeklyData]);

  // Transform aggregated data
  const transformAggregatedData = useCallback((rawData) => {
    if (!rawData || !Array.isArray(rawData)) {
      return [];
    }

    return rawData.map((item, index) => {
      const stateName = stateAbbrevToStateName[item.state] || item.state;
      const locationName = dataMode === DATA_MODES.COUNTY ? item.county : item.rangerDistrict;

      // Helper function to get value with fallbacks
      const getValue = (primary, ...fallbacks) => {
        if (primary !== undefined && primary !== null) {
          return primary;
        }
        for (const fallback of fallbacks) {
          if (fallback !== undefined && fallback !== null) {
            return fallback;
          }
        }
        return 0;
      };

      // Handle spots - can be spots, spotst0, or sumSpots
      const spotsValue = getValue(item.spots, item.spotst0);

      // Handle trapCount - can be trapCount or sumTrapCount
      const trapCount = getValue(item.trapCount, item.sumTrapCount);

      // Handle totalTrappingDays
      const totalTrappingDays = getValue(item.totalTrappingDays, item.sumTotalTrappingDays);

      // Handle beetles/spb
      const beetles = getValue(item.spb, item.sumSpb, item.spbCount);

      // Handle spbPer2Weeks
      const spbPer2Weeks = getValue(item.spbPer2Weeks, item.sumSpbPer2Weeks);

      // Handle clerids
      const clerids = getValue(item.clerids, item.sumClerids);

      // Handle spotst1
      const spotst1 = getValue(item.spotst1, item.sumSpotst1);

      // Calculate daysPerTrap
      let daysPerTrap = 0;
      if (item.daysPerTrap !== undefined && item.daysPerTrap !== null) {
        daysPerTrap = item.daysPerTrap;
      } else if (totalTrappingDays > 0 && trapCount > 0) {
        daysPerTrap = totalTrappingDays / trapCount;
      }

      // Handle year - check multiple possible field names
      // API might return year in different fields: year, Year, YEAR, or it might be missing
      let yearValue = null;
      const yearFields = ['year', 'Year', 'YEAR', 'yr', 'Yr', 'YR'];

      for (const fieldName of yearFields) {
        if (item[fieldName] !== undefined && item[fieldName] !== null && item[fieldName] !== '') {
          const yearData = item[fieldName];
          if (typeof yearData === 'string') {
            const parsedYear = Number.parseInt(yearData.trim(), 10);
            if (!Number.isNaN(parsedYear) && parsedYear > 1900 && parsedYear < 2100) {
              yearValue = parsedYear;
              break;
            }
          } else if (typeof yearData === 'number') {
            if (!Number.isNaN(yearData) && yearData > 1900 && yearData < 2100) {
              yearValue = yearData;
              break;
            }
          }
        }
      }

      // If still no year found, log for debugging
      if (index === 0 && process.env.NODE_ENV === 'development') {
        console.log('🔍 [DEBUG] Year field check:', {
          hasYear: 'year' in item,
          yearValue: item.year,
          yearType: typeof item.year,
          allKeys: Object.keys(item),
          itemSample: item,
        });
      }

      return {
        id: `agg-${index}`,
        year: yearValue,
        state: stateName || 'N/A',
        county: locationName || 'N/A',
        trapCount,
        totalTrappingDays,
        daysPerTrap,
        beetles,
        spbPer2Weeks,
        clerids,
        spots: spotsValue,
        spotst1,
        probSpotsGT0: getValue(item.probSpotsGT0),
        probSpotsGT50: getValue(item.probSpotsGT50),
        probSpotsGT150: getValue(item.probSpotsGT150),
        probSpotsGT400: getValue(item.probSpotsGT400),
        probSpotsGT1000: getValue(item.probSpotsGT1000),
        predSpotsorigUnits: getValue(item.predSpotsorigUnits),
        residualSpotslogUnits: getValue(item.residualSpotslogUnits),
      };
    });
  }, [dataMode]);

  // Get the appropriate data source based on format
  const rawData = useMemo(() => {
    if (dataFormat === 'raw') {
      return sparseData || [];
    }
    return sublocationData || [];
  }, [dataFormat, sparseData, sublocationData]);

  // Transform data based on format
  const transformedData = useMemo(() => {
    if (dataFormat === 'raw') {
      return transformRawData(rawData);
    }
    const transformed = transformAggregatedData(rawData);
    // Debug: log data counts for aggregated data
    if (dataFormat === 'aggregated' && process.env.NODE_ENV === 'development') {
      console.log('🔍 [DEBUG] Aggregated Data:', {
        rawDataCount: rawData.length,
        transformedCount: transformed.length,
        rawDataSample: rawData.slice(0, 3),
        firstTransformed: transformed[0],
        yearFields: rawData.slice(0, 5).map((item) => ({
          year: item.year,
          yearType: typeof item.year,
          hasYear: 'year' in item,
        })),
      });
    }
    return transformed;
  }, [dataFormat, rawData, transformRawData, transformAggregatedData]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    const selectedStateName = getStateNameFromAbbreviation(reduxSelectedState);

    // Debug: log filtering stats for aggregated data
    if (dataFormat === 'aggregated' && process.env.NODE_ENV === 'development') {
      console.log('🔍 [DEBUG] Filtering Stats:', {
        transformedDataCount: transformedData.length,
        reduxStartYear,
        reduxEndYear,
        selectedStateName,
        reduxCounty: dataMode === DATA_MODES.COUNTY ? reduxCounty : null,
        reduxRangerDistrict: dataMode === DATA_MODES.RANGER_DISTRICT ? reduxRangerDistrict : null,
        showEmptyRecords,
      });
    }

    // Debug counters for aggregated data
    let yearFiltered = 0;
    let stateFiltered = 0;
    let locationFiltered = 0;
    let emptyFiltered = 0;

    const filtered = transformedData
      .filter((item) => {
        // Year filter
        let yearMatch = true;
        if (dataFormat === 'aggregated') {
          // For aggregated data, if year is null/undefined, include it
          // Only filter by year if both startYear and endYear are provided
          if (item.year === null || item.year === undefined) {
            yearMatch = true;
          } else if (reduxStartYear && reduxEndYear) {
            yearMatch = item.year >= reduxStartYear && item.year <= reduxEndYear;
            if (!yearMatch && dataFormat === 'aggregated') {
              yearFiltered += 1;
            }
          } else {
            // If no year filter is set, include all records
            yearMatch = true;
          }
        } else {
          // For raw data, only filter if year filters are set
          yearMatch = !reduxStartYear || !reduxEndYear || !item.year
            || (item.year >= reduxStartYear && item.year <= reduxEndYear);
        }

        if (!yearMatch) return false;

        // State filter
        const stateMatch = !selectedStateName || item.state === selectedStateName;
        if (!stateMatch && dataFormat === 'aggregated') {
          stateFiltered += 1;
        }

        if (!stateMatch) return false;

        // Location filter
        let locationMatch = true;
        if (selectedStateName) {
          if (dataMode === DATA_MODES.COUNTY) {
            locationMatch = !reduxCounty || reduxCounty.length === 0 || reduxCounty.includes(item.county);
          } else {
            locationMatch = !reduxRangerDistrict || reduxRangerDistrict.length === 0
              || reduxRangerDistrict.includes(item.county);
          }
        }
        if (!locationMatch && dataFormat === 'aggregated') {
          locationFiltered += 1;
        }

        if (!locationMatch) return false;

        // Empty records filter
        // For aggregated data, always show all records (they're summaries, so even 0 values are meaningful)
        // The showEmptyRecords checkbox doesn't apply to aggregated data since all records are meaningful
        let hasData = true;
        if (dataFormat === 'aggregated') {
          // Always show aggregated records - they're summaries and all are meaningful
          hasData = true;
        } else {
          // For raw data, filter based on showEmptyRecords
          hasData = showEmptyRecords
            || (item.spbCount !== undefined && item.spbCount > 0)
            || (item.cleridCount !== undefined && item.cleridCount > 0)
            || (item.trap !== undefined && item.trap !== 'N/A');
        }
        if (!hasData && dataFormat === 'aggregated') {
          emptyFiltered += 1;
        }

        return hasData;
      });

    // Debug: log filtered count for aggregated data
    if (dataFormat === 'aggregated' && process.env.NODE_ENV === 'development') {
      console.log('🔍 [DEBUG] Filtered Count:', {
        beforeFilter: transformedData.length,
        afterFilter: filtered.length,
        yearFiltered,
        stateFiltered,
        locationFiltered,
        emptyFiltered,
        filters: {
          reduxStartYear,
          reduxEndYear,
          selectedStateName,
          reduxCounty: dataMode === DATA_MODES.COUNTY ? reduxCounty : null,
          reduxRangerDistrict: dataMode === DATA_MODES.RANGER_DISTRICT ? reduxRangerDistrict : null,
        },
      });
    }

    const sorted = filtered
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
      });

    return sorted;
  }, [
    transformedData,
    reduxStartYear,
    reduxEndYear,
    reduxSelectedState,
    reduxCounty,
    reduxRangerDistrict,
    dataMode,
    sortField,
    sortDirection,
    showEmptyRecords,
    dataFormat,
  ]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);

  // Fetch available options when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getAvailableYears({ ...filters, isHistorical: true });
      getAvailableStates({ ...filters, isHistorical: true });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, dataMode, getAvailableYears, getAvailableStates]);

  // Fetch data when filters, dataMode, or dataFormat change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (dataFormat === 'raw') {
        getUnsummarizedData(filters);
      } else {
        getAggregateLocationData(filters);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, dataMode, dataFormat, getUnsummarizedData, getAggregateLocationData]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, dataMode, dataFormat, sortField, sortDirection, showEmptyRecords]);

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const setStateAbbrev = useCallback(
    (stateName) => {
      const stateAbbrev = getStateAbbreviationFromStateName(stateName);
      setState(stateAbbrev);
    },
    [setState],
  );

  const statesMappedToNames = useMemo(() => {
    return (availableHistoricalStates || []).map((abbrev) => getStateNameFromAbbreviation(abbrev)).filter((s) => !!s);
  }, [availableHistoricalStates]);

  const selectedStateName = useMemo(() => {
    return getStateNameFromAbbreviation(reduxSelectedState);
  }, [reduxSelectedState]);

  const revYears = useMemo(() => {
    return [...(availableHistoricalYears || [])].reverse();
  }, [availableHistoricalYears]);

  const handleRetry = useCallback(() => {
    if (dataFormat === 'raw') {
      getUnsummarizedData(filters);
    } else {
      getAggregateLocationData(filters);
    }
  }, [dataFormat, filters, getUnsummarizedData, getAggregateLocationData]);

  if (isLoading) {
    return (
      <div className="data-table-screen">
        <div className="data-table-container">
          <Loader visible={isLoading} message="Loading data..." />
        </div>
      </div>
    );
  }

  if (errorText) {
    return (
      <div className="data-table-screen">
        <div className="data-table-container">
          <div className="error-container">
            <h2>Error Loading Data</h2>
            <p>{errorText}</p>
            <button type="button" onClick={handleRetry} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="data-table-screen">
      <div className="data-table-container">
        <div className="page-header">
          <h1>Data Tables</h1>
        </div>

        <div className="table-controls">
          <div className="filters">
            <div className="filter-card">
              <div className="filter-card-header">
                <div className="filter-label">Time Range</div>
              </div>
              <div className="filter-card-content">
                <div className="year-range-inputs">
                  <div className="year-input-group">
                    <div className="input-label">Start Year</div>
                    <ChoiceInput
                      id="start-year-input"
                      options={availableHistoricalYears || []}
                      value={reduxStartYear}
                      setValue={setStartYear}
                      firstOptionText="Select start year"
                    />
                  </div>
                  <div className="year-input-group">
                    <div className="input-label">End Year</div>
                    <ChoiceInput
                      id="end-year-input"
                      options={revYears}
                      value={reduxEndYear}
                      setValue={setEndYear}
                      firstOptionText="Select end year"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="filter-card">
              <div className="filter-card-header">
                <div className="filter-label">Geographic Area</div>
              </div>
              <div className="filter-card-content">
                <div className="geographic-area-content">
                  <div className="admin-level-group">
                    <div className="input-label">Administrative Level</div>
                    <div className="toggle-buttons">
                      <button
                        type="button"
                        className={`toggle-btn ${dataMode === DATA_MODES.COUNTY ? 'active' : ''}`}
                        onClick={() => setDataMode(DATA_MODES.COUNTY)}
                      >
                        County
                      </button>
                      <button
                        type="button"
                        className={`toggle-btn ${dataMode === DATA_MODES.RANGER_DISTRICT ? 'active' : ''}`}
                        onClick={() => setDataMode(DATA_MODES.RANGER_DISTRICT)}
                      >
                        Federal Land
                      </button>
                    </div>
                  </div>
                  <div className="location-group">
                    <div className="input-label">Location</div>
                    <MultiSelectInput
                      id="location-input"
                      valueParent={selectedStateName}
                      valueChildren={dataMode === DATA_MODES.COUNTY ? reduxCounty : reduxRangerDistrict}
                      setValueParent={setStateAbbrev}
                      setValueChildren={dataMode === DATA_MODES.COUNTY ? setCounty : setRangerDistrict}
                      optionsParent={statesMappedToNames}
                      optionsChildren={availableHistoricalSublocations || []}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="filter-card">
              <div className="filter-card-header">
                <div className="filter-label">Data Format</div>
              </div>
              <div className="filter-card-content">
                <div className="radio-group">
                  <label
                    className={`radio-item ${dataFormat === 'raw' ? 'selected' : ''}`}
                    htmlFor="raw-data"
                  >
                    <input
                      type="radio"
                      id="raw-data"
                      name="data-format"
                      value="raw"
                      checked={dataFormat === 'raw'}
                      onChange={(e) => setDataFormat(e.target.value)}
                    />
                    <span className="radio-label">
                      <strong>Raw Data</strong>
                      <small>Weekly trap captures with individual records</small>
                    </span>
                  </label>
                  <label
                    className={`radio-item ${dataFormat === 'aggregated' ? 'selected' : ''}`}
                    htmlFor="aggregated-data"
                  >
                    <input
                      type="radio"
                      id="aggregated-data"
                      name="data-format"
                      value="aggregated"
                      checked={dataFormat === 'aggregated'}
                      onChange={(e) => setDataFormat(e.target.value)}
                    />
                    <span className="radio-label">
                      <strong>Aggregated Data</strong>
                      <small>Annual summaries per administrative unit</small>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('year')} className="sortable">
                  Year
                  {sortField === 'year' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('state')} className="sortable text-left">
                  State
                  {sortField === 'state' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('county')} className="sortable text-left">
                  {dataMode === 'COUNTY' ? 'County' : 'Ranger District'}
                  {sortField === 'county' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                {dataFormat === 'raw' ? (
                  <>
                    <th onClick={() => handleSort('trap')} className="sortable">
                      Trap
                      {sortField === 'trap' && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th onClick={() => handleSort('weekNumber')} className="sortable">
                      Week Number
                      {sortField === 'weekNumber' && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th onClick={() => handleSort('spbCount')} className="sortable">
                      SPB Count
                      {sortField === 'spbCount' && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th onClick={() => handleSort('cleridCount')} className="sortable">
                      Clerid Count
                      {sortField === 'cleridCount' && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th onClick={() => handleSort('collectionDate')} className="sortable">
                      Collection Date
                      {sortField === 'collectionDate' && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                  </>
                ) : (
                  <>
                    <th onClick={() => handleSort('trapCount')} className="sortable">
                      Trap Count
                      {sortField === 'trapCount' && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th onClick={() => handleSort('spbPer2Weeks')} className="sortable">
                      SPB per 2 Weeks
                      {sortField === 'spbPer2Weeks' && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th onClick={() => handleSort('probSpotsGT50')} className="sortable">
                      Prob &gt; 50 Spots
                      {sortField === 'probSpotsGT50' && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th onClick={() => handleSort('predSpotsorigUnits')} className="sortable">
                      Predicted Spots
                      {sortField === 'predSpotsorigUnits' && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={dataFormat === 'raw' ? 8 : 7} className="no-data">
                    No data available for the selected filters
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => {
                  // Display year - handle null, undefined, and ensure it's a number
                  let yearDisplay = 'N/A';
                  if (item.year !== null && item.year !== undefined) {
                    let yearNum = null;
                    if (typeof item.year === 'number') {
                      yearNum = item.year;
                    } else if (typeof item.year === 'string') {
                      yearNum = Number.parseInt(item.year.trim(), 10);
                    }

                    if (yearNum !== null && !Number.isNaN(yearNum) && yearNum > 1900 && yearNum < 2100) {
                      yearDisplay = yearNum;
                    } else if (dataFormat === 'aggregated') {
                      // For aggregated data, show dash if year is invalid
                      yearDisplay = '—';
                    }
                  } else if (dataFormat === 'aggregated') {
                    // For aggregated data without year, show dash
                    yearDisplay = '—';
                  }
                  return (
                    <tr key={item.id}>
                      <td>{yearDisplay}</td>
                      <td className="text-left">{item.state}</td>
                      <td className="text-left">{item.county}</td>
                      {dataFormat === 'raw' ? (
                        <>
                          <td>{item.trap || 'N/A'}</td>
                          <td>{item.weekNumber !== null && item.weekNumber !== undefined ? item.weekNumber : 'N/A'}</td>
                          <td>{item.spbCount !== undefined && item.spbCount !== null ? item.spbCount.toLocaleString() : 'N/A'}</td>
                          <td>{item.cleridCount !== undefined && item.cleridCount !== null ? item.cleridCount.toLocaleString() : 'N/A'}</td>
                          <td>
                            {item.collectionDate
                              ? (() => {
                                try {
                                  const date = new Date(item.collectionDate);
                                  if (!Number.isNaN(date.getTime())) {
                                    return date.toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                    });
                                  }
                                  return item.collectionDate;
                                } catch (e) {
                                  return item.collectionDate;
                                }
                              })()
                              : 'N/A'}
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{item.trapCount !== undefined ? item.trapCount.toLocaleString() : 'N/A'}</td>
                          <td>{item.spbPer2Weeks !== undefined ? item.spbPer2Weeks.toLocaleString() : 'N/A'}</td>
                          <td className="probability-cell">
                            {item.probSpotsGT50 !== undefined ? `${(item.probSpotsGT50 * 100).toFixed(1)}%` : 'N/A'}
                          </td>
                          <td className="prediction-cell">
                            {item.predSpotsorigUnits !== undefined ? item.predSpotsorigUnits.toFixed(1) : 'N/A'}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <div className="table-footer-content">
            <p>
              Showing {paginatedData.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} -{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedData.length)} of{' '}
              {filteredAndSortedData.length} records
            </p>
            <div className="table-footer-controls">
              <label className="show-empty-toggle" htmlFor="show-empty-records">
                <input
                  id="show-empty-records"
                  type="checkbox"
                  checked={showEmptyRecords}
                  onChange={(e) => setShowEmptyRecords(e.target.checked)}
                />
                <span>Show records with no data</span>
              </label>
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DataTableScreen);
