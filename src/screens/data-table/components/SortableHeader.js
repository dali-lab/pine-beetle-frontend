import React, { memo } from 'react';

const SortableHeader = memo(({
  field,
  label,
  sortField,
  sortDirection,
  onSort,
  className = '',
}) => (
  <th onClick={() => onSort(field)} className={`sortable ${className}`}>
    {label}
    {sortField === field && (
      <span className="sort-indicator">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    )}
  </th>
));

SortableHeader.displayName = 'SortableHeader';

export default SortableHeader;
