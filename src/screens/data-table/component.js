import React, {
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import { Loader } from '../../components';
import {
  useDataTableData,
  useDataTableFilters,
  useDataTableSorting,
  useDefaultYears,
  usePagination,
} from '../../hooks';
import {
  selectAvailableHistoricalStates,
  selectAvailableHistoricalSublocations,
  selectAvailableHistoricalYears,
  selectDataTableErrorText,
  selectIsDataTableLoading,
} from '../../state/selectors';
import { filterAndSortData, getStateNameFromAbbreviation } from '../../utils';
import {
  DATA_FORMATS,
  DataFormatFilter,
  DataTableView,
  GeographicAreaFilter,
  TableFooter,
  TimeRangeFilter,
} from './components';

import './style.scss';

const DataTableScreen = () => {
  const isLoading = useSelector(selectIsDataTableLoading);
  const errorText = useSelector(selectDataTableErrorText);
  const availableHistoricalYears = useSelector(selectAvailableHistoricalYears);
  const availableHistoricalStates = useSelector(selectAvailableHistoricalStates);
  const availableHistoricalSublocations = useSelector(selectAvailableHistoricalSublocations);

  const [dataFormat, setDataFormat] = useState(DATA_FORMATS.RAW);
  const [showEmptyRecords, setShowEmptyRecords] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const filters = useDataTableFilters();
  const { transformedData, fetchUnsummarizedData, fetchAggregateLocationData } = useDataTableData(
    filters.apiFilters,
    dataFormat,
    filters.dataMode
  );
  const { sortField, sortDirection, handleSort } = useDataTableSorting();

  useDefaultYears(
    availableHistoricalYears,
    filters.startYear,
    filters.endYear,
    filters.setStartYear,
    filters.setEndYear
  );

  const filteredAndSortedData = useMemo(
    () => filterAndSortData(
      transformedData,
      {
        startYear: filters.startYear,
        endYear: filters.endYear,
        selectedState: filters.selectedState,
        county: filters.county,
        rangerDistrict: filters.rangerDistrict,
        dataMode: filters.dataMode,
        dataFormat,
        showEmptyRecords,
      },
      {
        sortField,
        sortDirection,
      }
    ),
    [
      transformedData,
      filters.startYear,
      filters.endYear,
      filters.selectedState,
      filters.county,
      filters.rangerDistrict,
      filters.dataMode,
      dataFormat,
      showEmptyRecords,
      sortField,
      sortDirection,
    ]
  );

  const {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
  } = usePagination(
    filteredAndSortedData,
    [
      filters.startYear,
      filters.endYear,
      filters.selectedState,
      filters.county,
      filters.rangerDistrict,
      filters.dataMode,
      dataFormat,
      sortField,
      sortDirection,
      showEmptyRecords,
    ]
  );

  const statesMappedToNames = useMemo(
    () => (availableHistoricalStates || [])
      .map((abbrev) => getStateNameFromAbbreviation(abbrev))
      .filter((s) => !!s),
    [availableHistoricalStates]
  );

  const revYears = useMemo(
    () => [...(availableHistoricalYears || [])].reverse(),
    [availableHistoricalYears]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsInitialLoad(false);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleRetry = () => {
    if (dataFormat === DATA_FORMATS.RAW) {
      fetchUnsummarizedData(filters.apiFilters);
    } else {
      fetchAggregateLocationData(filters.apiFilters);
    }
  };

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
              startYear={filters.startYear}
              endYear={filters.endYear}
              setStartYear={filters.setStartYear}
              setEndYear={filters.setEndYear}
            />

            <GeographicAreaFilter
              dataMode={filters.dataMode}
              setDataMode={filters.setDataMode}
              selectedStateName={filters.selectedStateName}
              setStateAbbrev={filters.setStateAbbrev}
              statesMappedToNames={statesMappedToNames}
              county={filters.county}
              rangerDistrict={filters.rangerDistrict}
              setCounty={filters.setCounty}
              setRangerDistrict={filters.setRangerDistrict}
              availableSublocations={availableHistoricalSublocations}
            />

            <DataFormatFilter
              dataFormat={dataFormat}
              setDataFormat={setDataFormat}
            />
          </div>
        </div>

        {dataFormat === DATA_FORMATS.RAW && !filters.selectedState ? (
          <div className="info-message" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            <p>Please select a state to view raw trapping data.</p>
            <p style={{ fontSize: '0.9em' }}>Raw data queries are limited to prevent server overload.</p>
          </div>
        ) : (
          <DataTableView
            dataFormat={dataFormat}
            dataMode={filters.dataMode}
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
