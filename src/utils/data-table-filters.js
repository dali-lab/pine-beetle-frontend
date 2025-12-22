import { DATA_MODES } from '../constants';
import { DATA_FORMATS } from '../screens/data-table/components/constants';
import { getStateNameFromAbbreviation } from './abbreviation-mappings';

const filterAndSortData = (
  transformedData,
  {
    startYear,
    endYear,
    selectedState,
    county,
    rangerDistrict,
    dataMode,
    dataFormat,
    showEmptyRecords,
  },
  { sortField, sortDirection }
) => {
  const selectedStateName = getStateNameFromAbbreviation(selectedState);

  const filtered = transformedData.filter((item) => {
    let yearMatch = true;
    if (dataFormat === DATA_FORMATS.AGGREGATED) {
      if (item.year === null || item.year === undefined) {
        yearMatch = true;
      } else if (startYear && endYear) {
        yearMatch = item.year >= startYear && item.year <= endYear;
      }
    } else if (startYear && endYear && item.year) {
      yearMatch = item.year >= startYear && item.year <= endYear;
    }

    if (!yearMatch) return false;

    const stateMatch = !selectedStateName || item.state === selectedStateName;
    if (!stateMatch) return false;

    let locationMatch = true;
    if (selectedStateName) {
      if (dataMode === DATA_MODES.COUNTY) {
        locationMatch = !county || county.length === 0 || county.includes(item.county);
      } else {
        locationMatch = !rangerDistrict || rangerDistrict.length === 0
          || rangerDistrict.includes(item.county);
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

    const aIsNil = aValue === null || aValue === undefined;
    const bIsNil = bValue === null || bValue === undefined;
    if (aIsNil && bIsNil) return 0;
    if (aIsNil) return 1;
    if (bIsNil) return -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  return sorted;
};

export default filterAndSortData;
