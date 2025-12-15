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

  const [localStartYear, setLocalStartYear] = useState(reduxStartYear || '');
  const [localEndYear, setLocalEndYear] = useState(reduxEndYear || '');
  const [localState, setLocalState] = useState(reduxSelectedState || '');
  const [localCounty, setLocalCounty] = useState(reduxCounty || []);
  const [localRangerDistrict, setLocalRangerDistrict] = useState(reduxRangerDistrict || []);
  useEffect(() => {
    if (reduxStartYear !== localStartYear) setLocalStartYear(reduxStartYear || '');
    if (reduxEndYear !== localEndYear) setLocalEndYear(reduxEndYear || '');
    if (reduxSelectedState !== localState) setLocalState(reduxSelectedState || '');
    if (JSON.stringify(reduxCounty) !== JSON.stringify(localCounty)) setLocalCounty(reduxCounty || []);
    if (JSON.stringify(reduxRangerDistrict) !== JSON.stringify(localRangerDistrict)) setLocalRangerDistrict(reduxRangerDistrict || []);
  }, [reduxStartYear, reduxEndYear, reduxSelectedState, reduxCounty, reduxRangerDistrict, localStartYear, localEndYear, localState, localCounty, localRangerDistrict]);

  const prevFiltersRef = useRef(null);
  const prevDataFormatRef = useRef(dataFormat);
  const isInitialMount = useRef(true);
  const fetchTimeoutRef = useRef(null);
  const actionsRef = useRef({
    getSparseData,
    getUnsummarizedData,
    getAggregateLocationData,
    getAvailableStates,
    getAvailableYears,
  });

  const extractWeekNumber = useCallback((item) => {
    if (item.weekNumber !== undefined && item.weekNumber !== null) {
      return item.weekNumber;
    }

    if (item.season) {
      const seasonMatch = String(item.season).match(/(\d+)/);
      if (seasonMatch) {
        const weekNum = parseInt(seasonMatch[1], 10);
        if (weekNum >= 1 && weekNum <= 6) {
          return weekNum;
        }
      }
    }

    if (item.collectionDate) {
      try {
        const date = new Date(item.collectionDate);
        if (!Number.isNaN(date.getTime()) && item.startDate) {
          const startDate = new Date(item.startDate);
          if (!Number.isNaN(startDate.getTime())) {
            const diffTime = date.getTime() - startDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const weekNum = Math.floor(diffDays / 14) + 1;
            if (weekNum >= 1 && weekNum <= 6) {
              return weekNum;
            }
          }
        }
      } catch (e) {
        // Ignore date parsing errors
      }
    }

    return null;
  }, []);

  const normalizeWeeklyData = useCallback((rawData) => {
    if (!rawData || !Array.isArray(rawData)) {
      console.log('🔍 [DEBUG] normalizeWeeklyData - rawData is empty or not array:', rawData);
      return [];
    }

    console.log('🔍 [DEBUG] normalizeWeeklyData - rawData length:', rawData.length);

    const normalized = [];

    rawData.forEach((item, index) => {
      if (index === 0) {
        console.log('🔍 [DEBUG] normalizeWeeklyData - first item keys:', Object.keys(item));
        console.log('🔍 [DEBUG] normalizeWeeklyData - first item:', JSON.stringify(item, null, 2));
      }

      const weekFields = Object.keys(item).filter((key) => /^week\d+$/i.test(key));

      if (weekFields.length > 0) {
        if (index === 0) {
          console.log('🔍 [DEBUG] normalizeWeeklyData - Found week fields:', weekFields);
        }
        weekFields.forEach((weekField) => {
          const weekNumber = parseInt(weekField.replace(/week/i, ''), 10);
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
        if (index === 0) {
          console.log('🔍 [DEBUG] normalizeWeeklyData - No week fields found, checking for weekNumber');
          console.log('🔍 [DEBUG] normalizeWeeklyData - weekNumber:', item.weekNumber);
          console.log('🔍 [DEBUG] normalizeWeeklyData - spbCount:', item.spbCount);
          console.log('🔍 [DEBUG] normalizeWeeklyData - trap:', item.trap);
          console.log('🔍 [DEBUG] normalizeWeeklyData - collectionDate:', item.collectionDate);
        }
        const weekNumber = extractWeekNumber(item);
        normalized.push({
          ...item,
          weekNumber: weekNumber !== null ? weekNumber : null,
        });
      }
    });

    console.log('🔍 [DEBUG] normalizeWeeklyData - normalized length:', normalized.length);
    if (normalized.length > 0) {
      console.log('🔍 [DEBUG] normalizeWeeklyData - first normalized item:', JSON.stringify(normalized[0], null, 2));
    }

    return normalized;
  }, [extractWeekNumber]);

  const transformData = useCallback((rawData) => {
    if (!rawData || !Array.isArray(rawData)) {
      console.log('🔍 [DEBUG] transformData - rawData is empty or not array:', rawData);
      return [];
    }

    console.log('🔍 [DEBUG] transformData - rawData length:', rawData.length);
    console.log('🔍 [DEBUG] transformData - first item before normalization:', rawData[0] ? JSON.stringify(rawData[0], null, 2) : 'N/A');

    const normalizedData = normalizeWeeklyData(rawData);

    console.log('🔍 [DEBUG] transformData - normalizedData length:', normalizedData.length);
    console.log('🔍 [DEBUG] transformData - first item after normalization:', normalizedData[0] ? JSON.stringify(normalizedData[0], null, 2) : 'N/A');

    if (normalizedData.length === 0) return [];

    const firstItem = normalizedData[0];
    if (!firstItem) return [];

    const hasUnsummarizedFields = firstItem.spbCount !== undefined
      || (firstItem.trap !== undefined && firstItem.trap !== null)
      || firstItem.collectionDate !== undefined
      || firstItem.cleridCount !== undefined;

    console.log('🔍 [DEBUG] transformData - hasUnsummarizedFields:', hasUnsummarizedFields);
    console.log('🔍 [DEBUG] transformData - isUnsummarizedData:', hasUnsummarizedFields);
    console.log('🔍 [DEBUG] transformData - firstItem.spbCount:', firstItem.spbCount);
    console.log('🔍 [DEBUG] transformData - firstItem.trap:', firstItem.trap);
    console.log('🔍 [DEBUG] transformData - firstItem.collectionDate:', firstItem.collectionDate);
    console.log('🔍 [DEBUG] transformData - firstItem.cleridCount:', firstItem.cleridCount);

    const isUnsummarizedData = hasUnsummarizedFields;

    if (isUnsummarizedData) {
      return normalizedData.map((item, index) => {
        const stateName = stateAbbrevToStateName[item.state] || item.state;
        const locationName = dataMode === DATA_MODES.COUNTY ? item.county : item.rangerDistrict;

        return {
          id: index + 1,
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
    } else {
      return normalizedData.map((item, index) => {
        const stateName = stateAbbrevToStateName[item.state] || item.state;
        const locationName = dataMode === DATA_MODES.COUNTY ? item.county : item.rangerDistrict;
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
          trapCount: item.trapCount || 0,
          totalTrappingDays: item.totalTrappingDays || 0,
          daysPerTrap: item.daysPerTrap || 0,
          beetles: item.spb || item.spbCount || 0,
          spbPer2Weeks: item.spbPer2Weeks || 0,
          clerids: item.clerids || 0,
          spots: spotsValue,
          spotst1: item.spotst1 || 0,
          probSpotsGT0: item.probSpotsGT0 || 0,
          probSpotsGT50: item.probSpotsGT50 || 0,
          probSpotsGT150: item.probSpotsGT150 || 0,
          probSpotsGT400: item.probSpotsGT400 || 0,
          probSpotsGT1000: item.probSpotsGT1000 || 0,
          predSpotsorigUnits: item.predSpotsorigUnits || 0,
          residualSpotslogUnits: item.residualSpotslogUnits || 0,
        };
      });
    }
  }, [dataMode, normalizeWeeklyData]);

  const transformAggregatedData = useCallback((rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];

    if (rawData.length > 0) {
      console.log('🔍 [DEBUG] transformAggregatedData - first item before transform:', JSON.stringify(rawData[0], null, 2));
      console.log('🔍 [DEBUG] transformAggregatedData - first item.year:', rawData[0]?.year);
    }

    return rawData.map((item, index) => {
      const stateName = stateAbbrevToStateName[item.state] || item.state;
      const locationName = dataMode === DATA_MODES.COUNTY ? item.county : item.rangerDistrict;

      const spotsValue = item.spots || item.spotst0 || 0;

      const transformed = {
        id: index + 1,
        year: item.year !== undefined ? item.year : null,
        state: stateName,
        county: locationName,
        trapCount: item.trapCount || item.sumTrapCount || 0,
        totalTrappingDays: item.totalTrappingDays || item.sumTotalTrappingDays || 0,
        daysPerTrap: item.daysPerTrap || (item.sumTotalTrappingDays && item.sumTrapCount ? item.sumTotalTrappingDays / item.sumTrapCount : 0),
        beetles: item.spb || item.sumSpb || item.spbCount || 0,
        spbPer2Weeks: item.spbPer2Weeks || item.sumSpbPer2Weeks || 0,
        clerids: item.clerids || item.sumClerids || 0,
        spots: spotsValue,
        spotst1: item.spotst1 || item.sumSpotst1 || 0,
        probSpotsGT0: item.probSpotsGT0 || 0,
        probSpotsGT50: item.probSpotsGT50 || 0,
        probSpotsGT150: item.probSpotsGT150 || 0,
        probSpotsGT400: item.probSpotsGT400 || 0,
        probSpotsGT1000: item.probSpotsGT1000 || 0,
        predSpotsorigUnits: item.predSpotsorigUnits || 0,
        residualSpotslogUnits: item.residualSpotslogUnits || 0,
      };

      if (index === 0) {
        console.log('🔍 [DEBUG] transformAggregatedData - first item after transform:', JSON.stringify(transformed, null, 2));
      }

      return transformed;
    });
  }, [dataMode]);

  const data = useMemo(() => {
    console.log('🔍 [DEBUG] data useMemo - dataFormat:', dataFormat);
    console.log('🔍 [DEBUG] data useMemo - sparseData length:', sparseData?.length || 0);
    console.log('🔍 [DEBUG] data useMemo - sublocationData length:', sublocationData?.length || 0);
    console.log('🔍 [DEBUG] data useMemo - sparseData first item:', sparseData?.[0] ? JSON.stringify(sparseData[0], null, 2) : 'N/A');
    console.log('🔍 [DEBUG] data useMemo - sublocationData first item:', sublocationData?.[0] ? JSON.stringify(sublocationData[0], null, 2) : 'N/A');

    if (dataFormat === 'raw') {
      return transformData(sparseData);
    } else {
      const aggregatedRawData = sublocationData && sublocationData.length > 0 && sublocationData[0]?.year !== undefined
        ? sublocationData
        : sparseData;
      return transformAggregatedData(aggregatedRawData);
    }
  }, [dataFormat, sparseData, sublocationData, transformData, transformAggregatedData]);

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

  useEffect(() => {
    actionsRef.current = {
      getAvailableYears,
      getAvailableStates,
      getSparseData,
      getUnsummarizedData,
      getAggregateLocationData,
    };
  }, [getAvailableYears, getAvailableStates, getSparseData, getUnsummarizedData, getAggregateLocationData]);

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

  const fetchData = useCallback(() => {
    const filters = {
      startYear: localStartYear || undefined,
      endYear: localEndYear || undefined,
      state: localState || undefined,
      county: localCounty && localCounty.length > 0 ? localCounty : undefined,
      rangerDistrict: localRangerDistrict && localRangerDistrict.length > 0 ? localRangerDistrict : undefined,
    };

    console.log('🔍 [DEBUG] fetchData - dataFormat:', dataFormat);
    console.log('🔍 [DEBUG] fetchData - filters:', filters);
    console.log('🔍 [DEBUG] fetchData - localStartYear:', localStartYear);
    console.log('🔍 [DEBUG] fetchData - localEndYear:', localEndYear);

    if (dataFormat === 'raw') {
      console.log('🔍 [DEBUG] fetchData - Calling getUnsummarizedData');
      console.log('🔍 [DEBUG] fetchData - actionsRef.current:', actionsRef.current);
      console.log('🔍 [DEBUG] fetchData - getUnsummarizedData exists:', typeof actionsRef.current.getUnsummarizedData);
      if (actionsRef.current && actionsRef.current.getUnsummarizedData) {
        actionsRef.current.getUnsummarizedData(filters);
      } else {
        console.error('❌ [ERROR] getUnsummarizedData is not available in actionsRef');
      }
    } else {
      console.log('🔍 [DEBUG] fetchData - Calling getAggregateLocationData');
      if (actionsRef.current && actionsRef.current.getAggregateLocationData) {
        actionsRef.current.getAggregateLocationData(filters);
      } else {
        console.error('❌ [ERROR] getAggregateLocationData is not available in actionsRef');
      }
    }
  }, [dataFormat, localStartYear, localEndYear, localState, localCounty, localRangerDistrict]);

  useEffect(() => {
    const currentFiltersKey = `${localStartYear}-${localEndYear}-${localState}-${Array.isArray(localCounty) ? localCounty.join(',') : localCounty}-${Array.isArray(localRangerDistrict) ? localRangerDistrict.join(',') : localRangerDistrict}`;
    const prevFiltersKey = prevFiltersRef.current;
    const filtersChanged = currentFiltersKey !== prevFiltersKey;
    const dataFormatChanged = dataFormat !== prevDataFormatRef.current;

    console.log('🔍 [DEBUG] fetchData useEffect - isInitialMount:', isInitialMount.current);
    console.log('🔍 [DEBUG] fetchData useEffect - filtersChanged:', filtersChanged);
    console.log('🔍 [DEBUG] fetchData useEffect - dataFormatChanged:', dataFormatChanged);
    console.log('🔍 [DEBUG] fetchData useEffect - dataFormat:', dataFormat);
    console.log('🔍 [DEBUG] fetchData useEffect - prevDataFormat:', prevDataFormatRef.current);

    if (isInitialMount.current || filtersChanged || dataFormatChanged) {
      console.log('🔍 [DEBUG] fetchData useEffect - Will fetch data');
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }

      const timeoutId = setTimeout(() => {
        console.log('🔍 [DEBUG] fetchData useEffect - setTimeout callback executed');
        const filters = {
          startYear: localStartYear || undefined,
          endYear: localEndYear || undefined,
          state: localState || undefined,
          county: localCounty && localCounty.length > 0 ? localCounty : undefined,
          rangerDistrict: localRangerDistrict && localRangerDistrict.length > 0 ? localRangerDistrict : undefined,
        };

        console.log('🔍 [DEBUG] fetchData useEffect - dataFormat:', dataFormat);
        console.log('🔍 [DEBUG] fetchData useEffect - filters:', filters);

        if (dataFormat === 'raw') {
          console.log('🔍 [DEBUG] fetchData useEffect - Calling getUnsummarizedData');
          if (actionsRef.current && actionsRef.current.getUnsummarizedData) {
            actionsRef.current.getUnsummarizedData(filters);
          } else {
            console.error('❌ [ERROR] getUnsummarizedData is not available in actionsRef');
          }
        } else {
          console.log('🔍 [DEBUG] fetchData useEffect - Calling getAggregateLocationData');
          if (actionsRef.current && actionsRef.current.getAggregateLocationData) {
            actionsRef.current.getAggregateLocationData(filters);
          } else {
            console.error('❌ [ERROR] getAggregateLocationData is not available in actionsRef');
          }
        }

        prevFiltersRef.current = currentFiltersKey;
        prevDataFormatRef.current = dataFormat;
        isInitialMount.current = false;
      }, 300);

      fetchTimeoutRef.current = timeoutId;
      console.log('🔍 [DEBUG] fetchData useEffect - setTimeout set, timeoutId:', timeoutId);
    } else {
      console.log('🔍 [DEBUG] fetchData useEffect - Skipping fetch (no changes)');
    }

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [dataFormat, localStartYear, localEndYear, localState, localCounty, localRangerDistrict]);

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const filteredAndSortedData = useMemo(() => {
    console.log('🔍 [DEBUG] filteredAndSortedData - data length:', data.length);
    console.log('🔍 [DEBUG] filteredAndSortedData - filters:', {
      localStartYear,
      localEndYear,
      selectedStateName,
      localCounty,
      localRangerDistrict,
      dataMode,
      showEmptyRecords,
      dataFormat,
    });

    const filtered = data
      .filter((item) => {
        let yearMatch = true;
        if (dataFormat === 'aggregated') {
          if (item.year === null || item.year === undefined) {
            yearMatch = true;
          } else if (localStartYear && localEndYear) {
            yearMatch = item.year >= localStartYear && item.year <= localEndYear;
          }
        } else {
          yearMatch = !localStartYear || !localEndYear || !item.year || (item.year >= localStartYear && item.year <= localEndYear);
        }

        const stateMatch = !selectedStateName || item.state === selectedStateName;

        let locationMatch = true;
        if (selectedStateName) {
          if (dataMode === DATA_MODES.COUNTY) {
            locationMatch = !localCounty || localCounty.length === 0 || localCounty.includes(item.county);
          } else {
            locationMatch = !localRangerDistrict || localRangerDistrict.length === 0 || localRangerDistrict.includes(item.county);
          }
        }

        const hasData = showEmptyRecords
          || (dataFormat === 'raw'
            ? (item.spbCount !== undefined || item.cleridCount !== undefined || item.trap !== undefined)
            : ((item.trapCount !== undefined && item.trapCount > 0) || (item.spbPer2Weeks !== undefined && item.spbPer2Weeks > 0)));

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

    console.log('🔍 [DEBUG] filteredAndSortedData - filtered length:', filtered.length);
    if (filtered.length > 0) {
      console.log('🔍 [DEBUG] filteredAndSortedData - first filtered item:', JSON.stringify(filtered[0], null, 2));
    }

    return filtered;
  }, [data, localStartYear, localEndYear, selectedStateName, localCounty, localRangerDistrict, dataMode, sortField, sortDirection, showEmptyRecords, dataFormat]);

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
              {filteredAndSortedData.map((item) => {
                let yearDisplay = 'N/A';
                if (item.year !== null && item.year !== undefined) {
                  yearDisplay = item.year;
                } else if (dataFormat === 'aggregated') {
                  yearDisplay = '-';
                }
                return (
                  <tr key={item.id}>
                    <td>{yearDisplay}</td>
                    <td>{item.state}</td>
                    <td>{item.county}</td>
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
                                  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
              })}
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
