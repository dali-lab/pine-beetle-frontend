import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Loader } from '../../components';
import { DATA_MODES, stateAbbrevToStateName } from '../../constants';
import {
  getAggregateLocationData,
  getAvailableStates,
  getAvailableYears,
  getUnsummarizedData,
  setCountyFilter as setCountyFilterAction,
  setDataMode as setDataModeAction,
  setEndYear as setEndYearAction,
  setRangerDistrictFilter as setRangerDistrictFilterAction,
  setStartYear as setStartYearAction,
  setState as setStateAction,
} from '../../state/actions';
import {
  selectAvailableHistoricalStates,
  selectAvailableHistoricalSublocations,
  selectAvailableHistoricalYears,
  selectCounty,
  selectDataMode,
  selectDataTableErrorText,
  selectEndYear,
  selectIsDataTableLoading,
  selectRangerDistrict,
  selectSelectedState,
  selectSparseData,
  selectStartYear,
  selectSublocationData,
} from '../../state/selectors';
import {
  getStateAbbreviationFromStateName,
  getStateNameFromAbbreviation,
  transformAggregatedData,
  transformRawData,
} from '../../utils';

import {
  DATA_FORMATS,
  DataFormatFilter,
  DataTableView,
  GeographicAreaFilter,
  ITEMS_PER_PAGE,
  TableFooter,
  TimeRangeFilter,
} from './components';

import './style.scss';

const DataTableScreen = () => {
  const dispatch = useDispatch();

  const sparseData = useSelector(selectSparseData);
  const sublocationData = useSelector(selectSublocationData);
  const isLoading = useSelector(selectIsDataTableLoading);
  const errorText = useSelector(selectDataTableErrorText);
  const dataMode = useSelector(selectDataMode);
  const reduxStartYear = useSelector(selectStartYear);
  const reduxEndYear = useSelector(selectEndYear);
  const reduxSelectedState = useSelector(selectSelectedState);
  const reduxCounty = useSelector(selectCounty);
  const reduxRangerDistrict = useSelector(selectRangerDistrict);
  const availableHistoricalYears = useSelector(selectAvailableHistoricalYears);
  const availableHistoricalStates = useSelector(selectAvailableHistoricalStates);
  const availableHistoricalSublocations = useSelector(selectAvailableHistoricalSublocations);

  const fetchUnsummarizedData = useCallback(
    (filters) => dispatch(getUnsummarizedData(filters)),
    [dispatch]
  );

  const fetchAggregateLocationData = useCallback(
    (filters) => dispatch(getAggregateLocationData(filters)),
    [dispatch]
  );

  const fetchAvailableStates = useCallback(
    (filters) => dispatch(getAvailableStates(filters)),
    [dispatch]
  );

  const fetchAvailableYears = useCallback(
    (filters) => dispatch(getAvailableYears(filters)),
    [dispatch]
  );

  const setStartYear = useCallback(
    (year) => dispatch(setStartYearAction(year)),
    [dispatch]
  );

  const setEndYear = useCallback(
    (year) => dispatch(setEndYearAction(year)),
    [dispatch]
  );

  const setState = useCallback(
    (state) => dispatch(setStateAction(state)),
    [dispatch]
  );

  const setCounty = useCallback(
    (county) => dispatch(setCountyFilterAction(county)),
    [dispatch]
  );

  const setRangerDistrict = useCallback(
    (rangerDistrict) => dispatch(setRangerDistrictFilterAction(rangerDistrict)),
    [dispatch]
  );

  const setDataMode = useCallback(
    (mode) => dispatch(setDataModeAction(mode)),
    [dispatch]
  );

  const [sortField, setSortField] = useState('year');
  const [sortDirection, setSortDirection] = useState('asc');
  const [dataFormat, setDataFormat] = useState(DATA_FORMATS.RAW);
  const [showEmptyRecords, setShowEmptyRecords] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [defaultYearsSet, setDefaultYearsSet] = useState(false);

  // Filters that require API fetch (year range, state, data mode)
  const apiFilters = useMemo(
    () => ({
      startYear: reduxStartYear || undefined,
      endYear: reduxEndYear || undefined,
      state: reduxSelectedState || undefined,
    }),
    [reduxStartYear, reduxEndYear, reduxSelectedState]
  );

  const rawData = useMemo(() => {
    if (dataFormat === DATA_FORMATS.RAW) {
      return sparseData || [];
    }
    return sublocationData || [];
  }, [dataFormat, sparseData, sublocationData]);

  const transformedData = useMemo(() => {
    try {
      if (dataFormat === DATA_FORMATS.RAW) {
        return transformRawData(rawData, dataMode, stateAbbrevToStateName);
      }
      return transformAggregatedData(rawData, dataMode, stateAbbrevToStateName);
    } catch (error) {
      console.error('Error transforming data:', error);
      return [];
    }
  }, [dataFormat, rawData, dataMode, stateAbbrevToStateName]);

  const filteredAndSortedData = useMemo(() => {
    const selectedStateName = getStateNameFromAbbreviation(reduxSelectedState);

    const filtered = transformedData
      .filter((item) => {
        let yearMatch = true;
        if (dataFormat === DATA_FORMATS.AGGREGATED) {
          if (item.year === null || item.year === undefined) {
            yearMatch = true;
          } else if (reduxStartYear && reduxEndYear) {
            yearMatch = item.year >= reduxStartYear && item.year <= reduxEndYear;
          } else {
            yearMatch = true;
          }
        } else if (!reduxStartYear || !reduxEndYear) {
          yearMatch = true;
        } else if (!item.year) {
          yearMatch = true;
        } else {
          yearMatch = item.year >= reduxStartYear && item.year <= reduxEndYear;
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
        if (dataFormat === DATA_FORMATS.AGGREGATED) {
          hasData = true;
        } else {
          hasData = showEmptyRecords
            || (item.spbCount !== undefined && item.spbCount > 0)
            || (item.cleridCount !== undefined && item.cleridCount > 0)
            || (item.trap !== undefined && item.trap !== 'N/A');
        }

        return hasData;
      });

    const sorted = filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle null/undefined - put them at the end
      const aIsNil = aValue === null || aValue === undefined;
      const bIsNil = bValue === null || bValue === undefined;
      if (aIsNil && bIsNil) return 0;
      if (aIsNil) return 1;
      if (bIsNil) return -1;

      // String comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      // Numeric comparison
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

  const yearsLoaded = availableHistoricalYears && availableHistoricalYears.length > 0;

  // Set default years (last 5 years) when years are loaded and no years are selected
  useEffect(() => {
    if (yearsLoaded && !reduxStartYear && !reduxEndYear && !defaultYearsSet) {
      const sortedYears = [...availableHistoricalYears].sort((a, b) => b - a);
      if (sortedYears.length > 0) {
        const latestYear = sortedYears[0];
        const startYear = sortedYears[Math.min(4, sortedYears.length - 1)];
        setStartYear(startYear);
        setEndYear(latestYear);
        setDefaultYearsSet(true);
      }
    }

    // Reset flag if years are manually cleared
    if ((!reduxStartYear || !reduxEndYear) && defaultYearsSet && !yearsLoaded) {
      setDefaultYearsSet(false);
    }
  }, [
    yearsLoaded,
    availableHistoricalYears,
    reduxStartYear,
    reduxEndYear,
    setStartYear,
    setEndYear,
    defaultYearsSet,
  ]);

  useEffect(() => {
    fetchAvailableYears({ isHistorical: true });
    fetchAvailableStates({ isHistorical: true });
  }, [dataMode]);

  useEffect(() => {
    if (!reduxStartYear || !reduxEndYear) {
      return undefined;
    }

    if (dataFormat === DATA_FORMATS.RAW && !reduxSelectedState) {
      return undefined;
    }

    const maxYearRange = dataFormat === DATA_FORMATS.RAW ? 2 : 5;
    const effectiveStartYear = Math.max(reduxStartYear, reduxEndYear - maxYearRange + 1);

    const safeFilters = {
      startYear: effectiveStartYear,
      endYear: reduxEndYear,
      state: reduxSelectedState || undefined,
    };

    const timeoutId = setTimeout(() => {
      if (dataFormat === DATA_FORMATS.RAW) {
        fetchUnsummarizedData(safeFilters);
      } else {
        fetchAggregateLocationData(safeFilters);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    reduxStartYear,
    reduxEndYear,
    reduxSelectedState,
    dataFormat,
    fetchUnsummarizedData,
    fetchAggregateLocationData,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    reduxStartYear,
    reduxEndYear,
    reduxSelectedState,
    reduxCounty,
    reduxRangerDistrict,
    dataMode,
    dataFormat,
    sortField,
    sortDirection,
    showEmptyRecords,
  ]);

  // Hide initial loader after first render cycle completes
  useEffect(() => {
    // Small delay to allow first API call to start, then hide loader
    const timeoutId = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

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
    [setState]
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
    if (dataFormat === DATA_FORMATS.RAW) {
      fetchUnsummarizedData(apiFilters);
    } else {
      fetchAggregateLocationData(apiFilters);
    }
  }, [dataFormat, apiFilters, fetchUnsummarizedData, fetchAggregateLocationData]);

  const isDataLoading = isInitialLoad || isLoading;

  if (isDataLoading) {
    return (
      <div className="data-table-screen">
        <div className="data-table-container">
          <div className="page-header">
            <h1>Data Tables</h1>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <Loader visible inline message="Loading data..." />
          </div>
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
            <TimeRangeFilter
              availableYears={availableHistoricalYears}
              revYears={revYears}
              startYear={reduxStartYear}
              endYear={reduxEndYear}
              setStartYear={setStartYear}
              setEndYear={setEndYear}
            />

            <GeographicAreaFilter
              dataMode={dataMode}
              setDataMode={setDataMode}
              selectedStateName={selectedStateName}
              setStateAbbrev={setStateAbbrev}
              statesMappedToNames={statesMappedToNames}
              county={reduxCounty}
              rangerDistrict={reduxRangerDistrict}
              setCounty={setCounty}
              setRangerDistrict={setRangerDistrict}
              availableSublocations={availableHistoricalSublocations}
            />

            <DataFormatFilter
              dataFormat={dataFormat}
              setDataFormat={setDataFormat}
            />
          </div>
        </div>

        {dataFormat === DATA_FORMATS.RAW && !reduxSelectedState ? (
          <div className="info-message" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            <p>Please select a state to view raw trapping data.</p>
            <p style={{ fontSize: '0.9em' }}>Raw data queries are limited to prevent server overload.</p>
          </div>
        ) : (
          <DataTableView
            dataFormat={dataFormat}
            dataMode={dataMode}
            paginatedData={paginatedData}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
          />
        )}

        <TableFooter
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={filteredAndSortedData.length}
          paginatedDataLength={paginatedData.length}
          showEmptyRecords={showEmptyRecords}
          setShowEmptyRecords={setShowEmptyRecords}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default memo(DataTableScreen);
