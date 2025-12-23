import React from 'react';

const TABLE_PREVIEW_DATA = [
  {
    year: '2023', state: 'AL', county: 'Baldwin', count: '3,100',
  },
  {
    year: '2023', state: 'AL', county: 'Mobile', count: '1,900',
  },
  {
    year: '2022', state: 'FL', county: 'Escambia', count: '2,200',
  },
];

const DataTablePreview = () => (
  <div className="data-table-preview">
    <div className="table-header">
      <div className="header-cell">Year</div>
      <div className="header-cell">State</div>
      <div className="header-cell">County</div>
      <div className="header-cell">Count</div>
    </div>
    {TABLE_PREVIEW_DATA.map((row) => (
      <div key={`${row.year}-${row.state}-${row.county}`} className="table-row">
        <div className="table-cell">{row.year}</div>
        <div className="table-cell">{row.state}</div>
        <div className="table-cell">{row.county}</div>
        <div className="table-cell">{row.count}</div>
      </div>
    ))}
  </div>
);

export default DataTablePreview;
