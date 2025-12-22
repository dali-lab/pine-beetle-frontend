export const ITEMS_PER_PAGE = 100;

export const DATA_FORMATS = {
  RAW: 'raw',
  AGGREGATED: 'aggregated',
};

export const formatYearDisplay = (year, dataFormat) => {
  if (year === null || year === undefined) {
    return dataFormat === DATA_FORMATS.AGGREGATED ? '—' : 'N/A';
  }

  const yearNum = typeof year === 'number' ? year : Number.parseInt(String(year).trim(), 10);

  if (!Number.isNaN(yearNum) && yearNum > 1900 && yearNum < 2100) {
    return yearNum;
  }

  return dataFormat === DATA_FORMATS.AGGREGATED ? '—' : 'N/A';
};
