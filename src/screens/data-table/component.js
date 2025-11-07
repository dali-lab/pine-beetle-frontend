import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
  getSparseData,
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

  // Use local state for filters to prevent Redux re-renders
  const [localStartYear, setLocalStartYear] = useState(reduxStartYear || '');
  const [localEndYear, setLocalEndYear] = useState(reduxEndYear || '');
  const [localState, setLocalState] = useState(reduxSelectedState || '');
  const [localCounty, setLocalCounty] = useState(reduxCounty || []);
  const [localRangerDistrict, setLocalRangerDistrict] = useState(reduxRangerDistrict || []);

  // Sync local state with Redux when Redux changes (but not vice versa on every keystroke)
  useEffect(() => {
    if (reduxStartYear !== localStartYear) setLocalStartYear(reduxStartYear || '');
    if (reduxEndYear !== localEndYear) setLocalEndYear(reduxEndYear || '');
    if (reduxSelectedState !== localState) setLocalState(reduxSelectedState || '');
    if (JSON.stringify(reduxCounty) !== JSON.stringify(localCounty)) setLocalCounty(reduxCounty || []);
    if (JSON.stringify(reduxRangerDistrict) !== JSON.stringify(localRangerDistrict)) setLocalRangerDistrict(reduxRangerDistrict || []);
  }, [reduxStartYear, reduxEndYear, reduxSelectedState, reduxCounty, reduxRangerDistrict, localStartYear, localEndYear, localState, localCounty, localRangerDistrict]);

  // Use refs to track previous values and prevent unnecessary fetches
  const prevFiltersRef = useRef(null);
  const prevDataFormatRef = useRef(null);
  const isInitialMount = useRef(true);
  const fetchTimeoutRef = useRef(null);
  const actionsRef = useRef({
    getSparseData,
    getAggregateLocationData,
    getAvailableStates,
    getAvailableYears,
  });

  // Transform API data to table format (for raw/sparse data)
  const transformData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];

    return rawData.map((item, index) => {
      const stateName = stateAbbrevToStateName[item.state] || item.state;
      const locationName = dataMode === DATA_MODES.COUNTY ? item.county : item.rangerDistrict;

      // Use spotst0 if available, otherwise fall back to spots
      // Only use spotst0 if it's actually defined and not null
      let spotsValue = 0;
      if (item.spotst0 !== undefined && item.spotst0 !== null) {
        spotsValue = item.spotst0;
      } else if (item.spots !== undefined && item.spots !== null) {
        spotsValue = item.spots;
      }

      return {
        id: index + 1,
        year: item.year,
        state: stateName,
        county: locationName,
        // Trapping details
        trapCount: item.trapCount || 0,
        totalTrappingDays: item.totalTrappingDays || 0,
        daysPerTrap: item.daysPerTrap || 0,
        // Beetle metrics
        beetles: item.spb || item.spbCount || 0,
        spbPer2Weeks: item.spbPer2Weeks || 0,
        clerids: item.clerids || 0,
        spots: spotsValue,
        spotst1: item.spotst1 || 0,
        // Probabilities (store as decimals, will format as percentages in display)
        probSpotsGT0: item.probSpotsGT0 || 0,
        probSpotsGT50: item.probSpotsGT50 || 0,
        probSpotsGT150: item.probSpotsGT150 || 0,
        probSpotsGT400: item.probSpotsGT400 || 0,
        probSpotsGT1000: item.probSpotsGT1000 || 0,
        // Predictions
        predSpotsorigUnits: item.predSpotsorigUnits || 0,
        residualSpotslogUnits: item.residualSpotslogUnits || 0,
      };
    });
  };

  // Transform aggregated data to table format
  const transformAggregatedData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];

    return rawData.map((item, index) => {
      const stateName = stateAbbrevToStateName[item.state] || item.state;
      const locationName = dataMode === DATA_MODES.COUNTY ? item.county : item.rangerDistrict;

      // Aggregated data typically has sum of spots, spb, clerids
      const spotsValue = item.spots || item.spotst0 || 0;

      return {
        id: index + 1,
        year: item.year || null, // Aggregated data may not have year if aggregated by location
        state: stateName,
        county: locationName,
        // Trapping details (may be aggregated)
        trapCount: item.trapCount || item.sumTrapCount || 0,
        totalTrappingDays: item.totalTrappingDays || item.sumTotalTrappingDays || 0,
        daysPerTrap: item.daysPerTrap || (item.sumTotalTrappingDays && item.sumTrapCount ? item.sumTotalTrappingDays / item.sumTrapCount : 0),
        // Beetle metrics (aggregated sums)
        beetles: item.spb || item.sumSpb || item.spbCount || 0,
        spbPer2Weeks: item.spbPer2Weeks || item.sumSpbPer2Weeks || 0,
        clerids: item.clerids || item.sumClerids || 0,
        spots: spotsValue,
        spotst1: item.spotst1 || item.sumSpotst1 || 0,
        // Probabilities (may not be available in aggregated data)
        probSpotsGT0: item.probSpotsGT0 || 0,
        probSpotsGT50: item.probSpotsGT50 || 0,
        probSpotsGT150: item.probSpotsGT150 || 0,
        probSpotsGT400: item.probSpotsGT400 || 0,
        probSpotsGT1000: item.probSpotsGT1000 || 0,
        // Predictions (may not be available in aggregated data)
        predSpotsorigUnits: item.predSpotsorigUnits || 0,
        residualSpotslogUnits: item.residualSpotslogUnits || 0,
      };
    });
  };

  // Get the appropriate data source based on format (memoized)
  const data = useMemo(() => {
    const rawData = dataFormat === 'raw' ? sparseData : sublocationData;
    return dataFormat === 'raw' ? transformData(rawData) : transformAggregatedData(rawData);
  }, [dataFormat, sparseData, sublocationData, dataMode]);

  // Prepare location filter data (memoized to prevent recalculation)
  const statesMappedToNames = useMemo(() => {
    return (availableHistoricalStates || []).map((abbrev) => getStateNameFromAbbreviation(abbrev)).filter((s) => !!s);
  }, [availableHistoricalStates]);

  const selectedStateName = useMemo(() => {
    return getStateNameFromAbbreviation(localState);
  }, [localState]);

  const setStateAbbrev = useCallback((stateName) => {
    const stateAbbrev = getStateAbbreviationFromStateName(stateName);
    setLocalState(stateAbbrev);
  }, []);

  const revYears = useMemo(() => {
    return [...(availableHistoricalYears || [])].reverse();
  }, [availableHistoricalYears]);

  // Update action refs when they change
  useEffect(() => {
    actionsRef.current = {
      getAvailableYears,
      getAvailableStates,
      getSparseData,
      getAggregateLocationData,
    };
  }, [getAvailableYears, getAvailableStates, getSparseData, getAggregateLocationData]);

  // Sync local filters to Redux with debounce (only when user stops changing)
  const syncToReduxTimeoutRef = useRef(null);
  const syncFiltersToRedux = useCallback(() => {
    if (syncToReduxTimeoutRef.current) {
      clearTimeout(syncToReduxTimeoutRef.current);
    }

    syncToReduxTimeoutRef.current = setTimeout(() => {
      if (localStartYear !== reduxStartYear) setStartYear(localStartYear);
      if (localEndYear !== reduxEndYear) setEndYear(localEndYear);
      if (localState !== reduxSelectedState) setState(localState);
      if (JSON.stringify(localCounty) !== JSON.stringify(reduxCounty)) setCounty(localCounty);
      if (JSON.stringify(localRangerDistrict) !== JSON.stringify(reduxRangerDistrict)) setRangerDistrict(localRangerDistrict);
    }, 500);
  }, [
    localStartYear,
    localEndYear,
    localState,
    localCounty,
    localRangerDistrict,
    reduxStartYear,
    reduxEndYear,
    reduxSelectedState,
    reduxCounty,
    reduxRangerDistrict,
    setStartYear,
    setEndYear,
    setState,
    setCounty,
    setRangerDistrict,
  ]);

  // Fetch available years and states only when filters actually change
  useEffect(() => {
    const currentFiltersKey = `${localStartYear}-${localEndYear}-${localState}-${Array.isArray(localCounty) ? localCounty.join(',') : localCounty}-${Array.isArray(localRangerDistrict) ? localRangerDistrict.join(',') : localRangerDistrict}-${dataMode}`;
    const prevFiltersKey = prevFiltersRef.current;

    if (isInitialMount.current || currentFiltersKey !== prevFiltersKey) {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }

      fetchTimeoutRef.current = setTimeout(() => {
        const filters = {
          startYear: localStartYear,
          endYear: localEndYear,
          state: localState,
          county: localCounty,
          rangerDistrict: localRangerDistrict,
        };
        actionsRef.current.getAvailableYears({ ...filters, isHistorical: true });
        actionsRef.current.getAvailableStates({ ...filters, isHistorical: true });
        prevFiltersRef.current = currentFiltersKey;
        syncFiltersToRedux();
      }, 300);
    }

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [localStartYear, localEndYear, localState, localCounty, localRangerDistrict, dataMode, syncFiltersToRedux]);

  // Function to fetch data
  const fetchData = useCallback(() => {
    const filters = {
      startYear: localStartYear,
      endYear: localEndYear,
      state: localState,
      county: localCounty,
      rangerDistrict: localRangerDistrict,
    };

    if (dataFormat === 'raw') {
      actionsRef.current.getSparseData(filters);
    } else {
      actionsRef.current.getAggregateLocationData(filters);
    }
  }, [dataFormat, localStartYear, localEndYear, localState, localCounty, localRangerDistrict]);

  // Fetch data only when format or filters actually change
  useEffect(() => {
    const currentFiltersKey = `${localStartYear}-${localEndYear}-${localState}-${Array.isArray(localCounty) ? localCounty.join(',') : localCounty}-${Array.isArray(localRangerDistrict) ? localRangerDistrict.join(',') : localRangerDistrict}`;
    const prevFiltersKey = prevFiltersRef.current;
    const filtersChanged = currentFiltersKey !== prevFiltersKey;
    const dataFormatChanged = dataFormat !== prevDataFormatRef.current;

    if (isInitialMount.current || filtersChanged || dataFormatChanged) {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }

      fetchTimeoutRef.current = setTimeout(() => {
        fetchData();
        prevFiltersRef.current = currentFiltersKey;
        prevDataFormatRef.current = dataFormat;
        isInitialMount.current = false;
      }, 300);
    }

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [dataFormat, localStartYear, localEndYear, localState, localCounty, localRangerDistrict, fetchData]);

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const filteredAndSortedData = useMemo(() => {
    return data
      .filter((item) => {
        // Filter by year range (only if both startYear and endYear are set)
        const yearMatch = !localStartYear || !localEndYear || !item.year || (item.year >= localStartYear && item.year <= localEndYear);

        // Filter by state
        const stateMatch = !selectedStateName || item.state === selectedStateName;

        // Filter by county/ranger district
        let locationMatch = true;
        if (selectedStateName) {
          if (dataMode === DATA_MODES.COUNTY) {
            locationMatch = !localCounty || localCounty.length === 0 || localCounty.includes(item.county);
          } else {
            locationMatch = !localRangerDistrict || localRangerDistrict.length === 0 || localRangerDistrict.includes(item.county);
          }
        }

        // Optionally exclude rows where trap count and SPB per 2 weeks are both 0
        const hasData = showEmptyRecords || item.trapCount > 0 || item.spbPer2Weeks > 0;

        return yearMatch && stateMatch && locationMatch && hasData;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  }, [data, localStartYear, localEndYear, selectedStateName, localCounty, localRangerDistrict, dataMode, sortField, sortDirection, showEmptyRecords]);

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
            <button type="button" onClick={() => fetchData()} className="retry-button">
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
          <h1>Historical Data Table</h1>
          <p className="page-description">
            Browse and analyze Southern Pine Beetle data including trap counts, beetle activity,
            outbreak probability, and predictions. Use filters and sorting options to
            explore trends across ranger districts and counties.
          </p>
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
                      value={localStartYear}
                      setValue={setLocalStartYear}
                      firstOptionText="Select start year"
                    />
                  </div>
                  <div className="year-input-group">
                    <div className="input-label">End Year</div>
                    <ChoiceInput
                      id="end-year-input"
                      options={revYears}
                      value={localEndYear}
                      setValue={setLocalEndYear}
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
                      valueChildren={dataMode === DATA_MODES.COUNTY ? localCounty : localRangerDistrict}
                      setValueParent={setStateAbbrev}
                      setValueChildren={dataMode === DATA_MODES.COUNTY ? setLocalCounty : setLocalRangerDistrict}
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
                <th onClick={() => handleSort('state')} className="sortable">
                  State
                  {sortField === 'state' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('county')} className="sortable">
                  {dataMode === 'COUNTY' ? 'County' : 'Ranger District'}
                  {sortField === 'county' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
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
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData.map((item) => (
                <tr key={item.id}>
                  <td>{item.year || 'N/A'}</td>
                  <td>{item.state}</td>
                  <td>{item.county}</td>
                  <td>{item.trapCount.toLocaleString()}</td>
                  <td>{item.spbPer2Weeks.toLocaleString()}</td>
                  <td className="probability-cell">{(item.probSpotsGT50 * 100).toFixed(1)}%</td>
                  <td className="prediction-cell">{item.predSpotsorigUnits.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <div className="table-footer-content">
            <p>Showing {filteredAndSortedData.length} of {data.length} records</p>
            <label className="show-empty-toggle" htmlFor="show-empty-records">
              <input
                id="show-empty-records"
                type="checkbox"
                checked={showEmptyRecords}
                onChange={(e) => setShowEmptyRecords(e.target.checked)}
              />
              <span>Show records with no data</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DataTableScreen);
