import { useCallback, useState } from 'react';

const useDataTableSorting = (defaultField = 'year', defaultDirection = 'asc') => {
  const [sortField, setSortField] = useState(defaultField);
  const [sortDirection, setSortDirection] = useState(defaultDirection);

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  return {
    sortField,
    sortDirection,
    handleSort,
  };
};

export default useDataTableSorting;
