import { useEffect, useMemo, useState } from 'react';
import { ITEMS_PER_PAGE } from '../screens/data-table/components/constants';

const usePagination = (data, dependencies = []) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, dependencies);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  return {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
  };
};

export default usePagination;
