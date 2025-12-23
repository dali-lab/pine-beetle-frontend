import React, { memo } from 'react';

import { ITEMS_PER_PAGE } from './constants';

const TableFooter = memo(({
  currentPage,
  totalPages,
  totalRecords,
  paginatedDataLength,
  showEmptyRecords,
  setShowEmptyRecords,
  setCurrentPage,
}) => (
  <div className="table-footer">
    <div className="table-footer-content">
      <p>
        Showing {paginatedDataLength > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} -{' '}
        {Math.min(currentPage * ITEMS_PER_PAGE, totalRecords)} of{' '}
        {totalRecords} records
      </p>
      <div className="table-footer-controls">
        <label className="show-empty-toggle" htmlFor="show-empty-records">
          <input
            id="show-empty-records"
            type="checkbox"
            checked={showEmptyRecords}
            onChange={(e) => setShowEmptyRecords(e.target.checked)}
          />
          <span>Show records with no data</span>
        </label>
        {totalPages > 1 && (
          <div className="pagination">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
));

TableFooter.displayName = 'TableFooter';

export default TableFooter;
