import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { stateAbbrevToStateName } from '../constants';
import {
  getAggregateLocationData,
  getAvailableStates,
  getAvailableYears,
  getUnsummarizedData,
} from '../state/actions';
import {
  selectSparseData,
  selectSublocationData,
} from '../state/selectors';
import {
  transformAggregatedData,
  transformRawData,
} from '../utils';
import { DATA_FORMATS } from '../screens/data-table/components/constants';

const useDataTableData = (filters, dataFormat, dataMode) => {
  const dispatch = useDispatch();

  const sparseData = useSelector(selectSparseData);
  const sublocationData = useSelector(selectSublocationData);

  const fetchUnsummarizedData = useCallback(
    (filterParams) => dispatch(getUnsummarizedData(filterParams)),
    [dispatch]
  );

  const fetchAggregateLocationData = useCallback(
    (filterParams) => dispatch(getAggregateLocationData(filterParams)),
    [dispatch]
  );

  const fetchAvailableStates = useCallback(
    (filterParams) => dispatch(getAvailableStates(filterParams)),
    [dispatch]
  );

  const fetchAvailableYears = useCallback(
    (filterParams) => dispatch(getAvailableYears(filterParams)),
    [dispatch]
  );

  useEffect(() => {
    fetchAvailableYears({ isHistorical: true });
    fetchAvailableStates({ isHistorical: true });
  }, [dataMode, fetchAvailableYears, fetchAvailableStates]);

  useEffect(() => {
    const { startYear, endYear, state } = filters;

    if (!startYear || !endYear) {
      return undefined;
    }

    if (dataFormat === DATA_FORMATS.RAW && !state) {
      return undefined;
    }

    const maxYearRange = dataFormat === DATA_FORMATS.RAW ? 2 : 5;
    const effectiveStartYear = Math.max(startYear, endYear - maxYearRange + 1);

    const safeFilters = {
      startYear: effectiveStartYear,
      endYear,
      state: state || undefined,
    };

    const timeoutId = setTimeout(() => {
      if (dataFormat === DATA_FORMATS.RAW) {
        fetchUnsummarizedData(safeFilters);
      } else {
        fetchAggregateLocationData(safeFilters);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, dataFormat, fetchUnsummarizedData, fetchAggregateLocationData]);

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
  }, [dataFormat, rawData, dataMode]);

  return {
    transformedData,
    fetchUnsummarizedData,
    fetchAggregateLocationData,
  };
};

export default useDataTableData;
