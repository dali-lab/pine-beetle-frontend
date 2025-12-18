import { DATA_MODES } from '../constants';

// Pre-compiled regex patterns for better performance
const WEEK_FIELD_REGEX = /^week\d+$/i;
const SEASON_NUMBER_REGEX = /(\d+)/;

/**
 * Extracts week number from various data sources
 * @param {Object} item - Data item containing week information
 * @returns {number|null} - Week number (1-6) or null if not found
 */
export const extractWeekNumber = (item) => {
  if (item.weekNumber !== undefined && item.weekNumber !== null) {
    return item.weekNumber;
  }

  if (item.season) {
    const seasonMatch = String(item.season).match(SEASON_NUMBER_REGEX);
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
      // eslint-disable-line no-empty
    }
  }

  return null;
};

/**
 * Normalizes weekly data from different formats
 * @param {Array} rawData - Raw data array
 * @returns {Array} - Normalized data array
 */
export const normalizeWeeklyData = (rawData) => {
  if (!rawData || !Array.isArray(rawData)) {
    return [];
  }

  const normalized = [];

  rawData.forEach((item) => {
    const weekFields = Object.keys(item).filter((key) => WEEK_FIELD_REGEX.test(key));

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
};

/**
 * Gets a value with fallbacks
 * @param {*} primary - Primary value
 * @param {...*} fallbacks - Fallback values
 * @returns {*} - First defined, non-null value or 0
 */
export const getValue = (primary, ...fallbacks) => {
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

/**
 * Parses year from various field names in an item
 * @param {Object} item - Data item
 * @returns {number|null} - Parsed year or null
 */
export const parseYearFromItem = (item) => {
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

  return yearValue;
};

/**
 * Transforms raw data to table format
 * @param {Array} rawData - Raw data array
 * @param {string} dataMode - Data mode (COUNTY or RANGER_DISTRICT)
 * @param {Object} stateAbbrevToStateName - Mapping of state abbreviations to names
 * @returns {Array} - Transformed data array
 */
export const transformRawData = (rawData, dataMode, stateAbbrevToStateName) => {
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
};

/**
 * Transforms aggregated data to table format
 * @param {Array} rawData - Raw aggregated data array
 * @param {string} dataMode - Data mode (COUNTY or RANGER_DISTRICT)
 * @param {Object} stateAbbrevToStateName - Mapping of state abbreviations to names
 * @returns {Array} - Transformed data array
 */
export const transformAggregatedData = (rawData, dataMode, stateAbbrevToStateName) => {
  if (!rawData || !Array.isArray(rawData)) {
    return [];
  }

  return rawData.map((item, index) => {
    const stateName = stateAbbrevToStateName[item.state] || item.state;
    const locationName = dataMode === DATA_MODES.COUNTY ? item.county : item.rangerDistrict;

    const spotsValue = getValue(item.spots, item.spotst0);
    const trapCount = getValue(item.trapCount, item.sumTrapCount);
    const totalTrappingDays = getValue(item.totalTrappingDays, item.sumTotalTrappingDays);
    const beetles = getValue(item.spb, item.sumSpb, item.spbCount);
    const spbPer2Weeks = getValue(item.spbPer2Weeks, item.sumSpbPer2Weeks);
    const clerids = getValue(item.clerids, item.sumClerids);
    const spotst1 = getValue(item.spotst1, item.sumSpotst1);

    let daysPerTrap = 0;
    if (item.daysPerTrap !== undefined && item.daysPerTrap !== null) {
      daysPerTrap = item.daysPerTrap;
    } else if (totalTrappingDays > 0 && trapCount > 0) {
      daysPerTrap = totalTrappingDays / trapCount;
    }

    const yearValue = parseYearFromItem(item);

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
};

/**
 * Formats collection date for display
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date string or original string if invalid
 */
export const formatCollectionDate = (dateString) => {
  if (!dateString) {
    return 'N/A';
  }

  try {
    const date = new Date(dateString);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return dateString;
  } catch (e) {
    return dateString;
  }
};
