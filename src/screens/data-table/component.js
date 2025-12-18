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
  setCounty as setCountyAction,
  setDataMode as setDataModeAction,
  setEndYear as setEndYearAction,
  setRangerDistrict as setRangerDistrictAction,
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
    (county) => dispatch(setCountyAction(county)),
    [dispatch]
  );

  const setRangerDistrict = useCallback(
    (rangerDistrict) => dispatch(setRangerDistrictAction(rangerDistrict)),
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
  const [isInitializing, setIsInitializing] = useState(true);

  const filters = useMemo(
    () => ({
      startYear: reduxStartYear || undefined,
      endYear: reduxEndYear || undefined,
      state: reduxSelectedState || undefined,
      county: reduxCounty && reduxCounty.length > 0 ? reduxCounty : undefined,
      rangerDistrict: reduxRangerDistrict && reduxRangerDistrict.length > 0 ? reduxRangerDistrict : undefined,
    }),
    [reduxStartYear, reduxEndYear, reduxSelectedState, reduxCounty, reduxRangerDistrict]
  );

  const rawData = useMemo(() => {
    if (dataFormat === DATA_FORMATS.RAW) {
      return sparseData || [];
    }
    return sublocationData || [];
  }, [dataFormat, sparseData, sublocationData]);

  const transformedData = useMemo(() => {
    if (dataFormat === DATA_FORMATS.RAW) {
      return transformRawData(rawData, dataMode, stateAbbrevToStateName);
    }
    return transformAggregatedData(rawData, dataMode, stateAbbrevToStateName);
  }, [dataFormat, rawData, dataMode]);

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

  const yearsLoaded = availableHistoricalYears && availableHistoricalYears.length > 0;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAvailableYears({ ...filters, isHistorical: true });
      fetchAvailableStates({ ...filters, isHistorical: true });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, dataMode, fetchAvailableYears, fetchAvailableStates]);

  useEffect(() => {
    if (!yearsLoaded) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      if (dataFormat === DATA_FORMATS.RAW) {
        fetchUnsummarizedData(filters);
      } else {
        fetchAggregateLocationData(filters);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, dataMode, dataFormat, fetchUnsummarizedData, fetchAggregateLocationData, yearsLoaded]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, dataMode, dataFormat, sortField, sortDirection, showEmptyRecords]);

  useEffect(() => {
    const hasData = dataFormat === DATA_FORMATS.RAW
      ? sparseData && sparseData.length > 0
      : sublocationData && sublocationData.length > 0;

    if (hasData && !isLoading) {
      setIsInitializing(false);
    }
  }, [sparseData, sublocationData, dataFormat, isLoading]);

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
      fetchUnsummarizedData(filters);
    } else {
      fetchAggregateLocationData(filters);
    }
  }, [dataFormat, filters, fetchUnsummarizedData, fetchAggregateLocationData]);

  const isDataLoading = !yearsLoaded || isLoading || isInitializing;

  if (isDataLoading) {
    return (
      <div className="data-table-screen">
        <div className="data-table-container">
          <Loader visible message="Loading data..." />
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

        <DataTableView
          dataFormat={dataFormat}
          dataMode={dataMode}
          paginatedData={paginatedData}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
        />

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
