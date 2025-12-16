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
  formatCollectionDate,
  getStateAbbreviationFromStateName,
  getStateNameFromAbbreviation,
  transformAggregatedData,
  transformRawData,
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

  const rawData = useMemo(() => {
    if (dataFormat === 'raw') {
      return sparseData || [];
    }
    return sublocationData || [];
  }, [dataFormat, sparseData, sublocationData]);

  const transformedData = useMemo(() => {
    if (dataFormat === 'raw') {
      return transformRawData(rawData, dataMode, stateAbbrevToStateName);
    }
    return transformAggregatedData(rawData, dataMode, stateAbbrevToStateName);
  }, [dataFormat, rawData, dataMode]);

  const filteredAndSortedData = useMemo(() => {
    const selectedStateName = getStateNameFromAbbreviation(reduxSelectedState);

    const filtered = transformedData
      .filter((item) => {
        let yearMatch = true;
        if (dataFormat === 'aggregated') {
          if (item.year === null || item.year === undefined) {
            yearMatch = true;
          } else if (reduxStartYear && reduxEndYear) {
            yearMatch = item.year >= reduxStartYear && item.year <= reduxEndYear;
          } else {
            yearMatch = true;
          }
        } else {
          yearMatch = !reduxStartYear || !reduxEndYear || !item.year
            || (item.year >= reduxStartYear && item.year <= reduxEndYear);
        }

        if (!yearMatch) return false;

        const stateMatch = !selectedStateName || item.state === selectedStateName;

        if (!stateMatch) return false;

        let locationMatch = true;
        if (selectedStateName) {
          if (dataMode === DATA_MODES.COUNTY) {
            locationMatch = !reduxCounty || reduxCounty.length === 0 || reduxCounty.includes(item.county);
          } else {
            locationMatch = !reduxRangerDistrict || reduxRangerDistrict.length === 0
              || reduxRangerDistrict.includes(item.county);
          }
        }

        if (!locationMatch) return false;

        let hasData = true;
        if (dataFormat === 'aggregated') {
          hasData = true;
        } else {
          hasData = showEmptyRecords
            || (item.spbCount !== undefined && item.spbCount > 0)
            || (item.cleridCount !== undefined && item.cleridCount > 0)
            || (item.trap !== undefined && item.trap !== 'N/A');
        }

        return hasData;
      });

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

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getAvailableYears({ ...filters, isHistorical: true });
      getAvailableStates({ ...filters, isHistorical: true });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, dataMode, getAvailableYears, getAvailableStates]);

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
                      yearDisplay = '—';
                    }
                  } else if (dataFormat === 'aggregated') {
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
                            {formatCollectionDate(item.collectionDate)}
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
